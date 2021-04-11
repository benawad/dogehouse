defmodule Broth.SocketHandler do
  require Logger

  alias Beef.Users
  alias Beef.Rooms
  alias Beef.Follows
  alias Ecto.UUID
  alias Beef.RoomPermissions

  @type state :: %__MODULE__{
          awaiting_init: boolean(),
          user_id: String.t(),
          encoding: :etf | :json,
          compression: nil | :zlib
        }

  defstruct awaiting_init: true,
            user_id: nil,
            encoding: nil,
            compression: nil,
            callers: []

  @behaviour :cowboy_websocket

  def init(request, _state) do
    props = :cowboy_req.parse_qs(request)

    compression =
      case :proplists.get_value("compression", props) do
        p when p in ["zlib_json", "zlib"] -> :zlib
        _ -> nil
      end

    encoding =
      case :proplists.get_value("encoding", props) do
        "etf" -> :etf
        _ -> :json
      end

    state = %__MODULE__{
      awaiting_init: true,
      user_id: nil,
      encoding: encoding,
      compression: compression,
      callers: get_callers(request)
    }

    {:cowboy_websocket, request, state}
  end

  if Mix.env() == :test do
    defp get_callers(request) do
      request_bin = :cowboy_req.header("user-agent", request)

      List.wrap(
        if is_binary(request_bin) do
          request_bin
          |> Base.decode16!()
          |> :erlang.binary_to_term()
        end
      )
    end
  else
    defp get_callers(_), do: []
  end

  @auth_timeout Application.compile_env(:kousa, :websocket_auth_timeout)

  def websocket_init(state) do
    Process.send_after(self(), :auth_timeout, @auth_timeout)
    Process.put(:"$callers", state.callers)

    {:ok, state}
  end

  def websocket_info(:auth_timeout, state) do
    if state.awaiting_init do
      {:stop, state}
    else
      {:ok, state}
    end
  end

  def websocket_info({:remote_send, message}, state) do
    {:reply, prepare_socket_msg(message, state), state}
  end

  # @todo when we swap this to new design change this to 1000
  def websocket_info({:kill}, state) do
    {:reply, {:close, 4003, "killed_by_server"}, state}
  end

  # needed for Task.async not to crash things
  def websocket_info({:EXIT, _, _}, state) do
    {:ok, state}
  end

  def websocket_info({:send_to_linked_session, message}, state) do
    send(state.linked_session, message)
    {:ok, state}
  end

  def websocket_handle({:text, "ping"}, state) do
    {:reply, prepare_socket_msg("pong", state), state}
  end

  def websocket_handle({:ping, _}, state) do
    {:reply, prepare_socket_msg("pong", state), state}
  end

  def websocket_handle({:text, command_json}, state) do
    with {:ok, command_map!} <- Jason.decode(command_json),
         # temporary trap mediasoup direct commands
         %{"op" => <<not_at>> <> _} when not_at != ?@ <- command_map!,
         # temporary translation from legacy maps to new maps
         command_map! = Broth.Translator.convert_legacy(command_map!),
         {:ok, command} <- Broth.Message.validate(command_map!),
         {:reply, reply, state} <- Broth.Executor.execute(command.payload, state) |> IO.inspect(label: "118") do
      reply_msg =
        reply
        |> prepare_reply(command.reference)
        |> prepare_socket_msg(state)

      {:reply, reply_msg, state}
    else
      mediasoup_op = %{"op" => "@" <> _} ->
        raise "foo"

      {:ok, state} ->
        {:noreply, state}

      {:error, changeset = %Ecto.Changeset{}} ->
        IO.inspect(command_json, label: "invalid command")
        IO.inspect(changeset, label: "changeset")
        {:reply, {:close, 4001, "invalid command"}, state}

      {:error, %Jason.DecodeError{}} ->
        {:reply, {:close, 4001, "invalid input"}, state}

      close = {:close, _error_code, _error_string} ->
        {:reply, close, state}
    end
  end

  if Mix.env() in [:test, :dev] do
    defdelegate validate_reply!(payload), to: Broth.Utils
  else
    def validate_reply!(_), do: :noop
  end

  def prepare_reply(payload = %reply_module{}, reference) do
    validate_reply!(payload)
    %{
      # TODO: deprecate "fetch_done" as the generic reply
      "op" =>
        :attributes
        |> reply_module.__info__()
        |> Keyword.get(:reply_operation, ["fetch_done"])
        |> List.first,
      # TODO: replace "d" with "p" as the reply payload parameter.
      "d" => payload,
      # TODO: replace "fetchId" with "ref"
      "fetchId" => reference
    }
  end

  def handler("invite_to_room", %{"userId" => user_id_to_invite}, state) do
    Kousa.Room.invite_to_room(state.user_id, user_id_to_invite)
    {:ok, state}
  end

  def handler("make_room_public", %{"newName" => new_name}, state) do
    Kousa.Room.make_room_public(state.user_id, new_name)
    {:ok, state}
  end

  def handler("ban", %{"username" => username, "reason" => reason}, state) do
    worked = Kousa.User.ban(state.user_id, username, reason)

    {:reply,
     prepare_socket_msg(
       %{
         op: "ban_done",
         d: %{worked: worked}
       },
       state
     ), state}
  end

  def handler("set_auto_speaker", %{"value" => value}, state) do
    Kousa.Room.set_auto_speaker(state.user_id, value)

    {:ok, state}
  end

  def handler("speaking_change", %{"value" => value}, state) do
    if current_room_id = Beef.Users.get_current_room_id(state.user_id) do
      Onion.RoomSession.speaking_change(current_room_id, state.user_id, value)
    end

    {:ok, state}
  end

  def handler("leave_room", _data, state) do
    case Kousa.Room.leave_room(state.user_id) do
      {:ok, d} ->
        {:reply, prepare_socket_msg(%{op: "you_left_room", d: d}, state), state}

      _ ->
        {:ok, state}
    end
  end

  def handler(
        "block_from_room",
        %{"userId" => user_id_to_block_from_room},
        state
      ) do
    Kousa.Room.block_from_room(state.user_id, user_id_to_block_from_room)
    {:ok, state}
  end

  def handler("add_speaker", %{"userId" => user_id_to_make_speaker}, state) do
    Kousa.Room.make_speaker(state.user_id, user_id_to_make_speaker)
    {:ok, state}
  end

  def handler("change_mod_status", %{"userId" => user_id_to_change, "value" => value}, state) do
    Kousa.Room.change_mod(state.user_id, user_id_to_change, value)
    {:ok, state}
  end

  def handler("block_user_and_from_room", %{"userId" => user_id_to_block}, state) do
    Kousa.UserBlock.block(state.user_id, user_id_to_block)
    Kousa.Room.block_from_room(state.user_id, user_id_to_block)
    {:ok, state}
  end

  def handler("change_room_creator", %{"userId" => user_id_to_change}, state) do
    Kousa.Room.change_room_creator(state.user_id, user_id_to_change)
    {:ok, state}
  end

  def handler("ban_from_room_chat", %{"userId" => user_id_to_ban}, state) do
    Kousa.RoomChat.ban_user(state.user_id, user_id_to_ban)
    {:ok, state}
  end

  # def handler("delete_account", _data, state) do
  #   Kousa.User.delete(state.user_id)
  #   # this will log the user out
  #   {:reply, {:close, 4001, "invalid_authentication"}, state}
  # end

  def handler(
        "delete_room_chat_message",
        %{"messageId" => message_id, "userId" => user_id},
        state
      ) do
    Kousa.RoomChat.delete_message(state.user_id, message_id, user_id)
    {:ok, state}
  end

  def handler("follow", %{"userId" => userId, "value" => value}, state) do
    Kousa.Follow.follow(state.user_id, userId, value)
    {:ok, state}
  end

  def handler(
        "fetch_follow_list",
        %{"userId" => user_id, "isFollowing" => get_following_list, "cursor" => cursor},
        state
      ) do
    {users, next_cursor} =
      Kousa.Follow.get_follow_list(state.user_id, user_id, get_following_list, cursor)

    {:reply,
     prepare_socket_msg(
       %{
         op: "fetch_follow_list_done",
         d: %{
           isFollowing: get_following_list,
           userId: user_id,
           users: users,
           nextCursor: next_cursor,
           initial: cursor == 0
         }
       },
       state
     ), state}
  end

  def handler("set_listener", %{"userId" => user_id_to_make_listener}, state) do
    Kousa.Room.set_listener(state.user_id, user_id_to_make_listener)
    {:ok, state}
  end

  def handler("mute", %{"value" => value}, state) do
    Onion.UserSession.set_mute(state.user_id, value)
    {:ok, state}
  end

  def handler("ask_to_speak", _data, state) do
    with {:ok, room_id} <- Users.tuple_get_current_room_id(state.user_id) do
      case RoomPermissions.ask_to_speak(state.user_id, room_id) do
        {:ok, %{isSpeaker: true}} ->
          Kousa.Room.internal_set_speaker(state.user_id, room_id)

        _ ->
          Onion.RoomSession.broadcast_ws(
            room_id,
            %{
              op: "hand_raised",
              d: %{userId: state.user_id, roomId: room_id}
            }
          )
      end
    end

    {:ok, state}
  end

  def handler("audio_autoplay_error", _data, state) do
    Onion.UserSession.send_ws(
      state.user_id,
      nil,
      %{
        op: "error",
        d: "browser can't autoplay audio the first time, go press play audio in your browser"
      }
    )

    {:ok, state}
  end

  def handler(op, data, state) do
    with {:ok, room_id} <- Beef.Users.tuple_get_current_room_id(state.user_id) do
      voice_server_id = Onion.RoomSession.get(room_id, :voice_server_id)

      d =
        if String.first(op) == "@" do
          Map.merge(data, %{
            peerId: state.user_id,
            roomId: room_id
          })
        else
          data
        end

      Onion.VoiceRabbit.send(voice_server_id, %{
        op: op,
        d: d,
        uid: state.user_id
      })

      {:ok, state}
    else
      x ->
        IO.puts("you should never see this general rabbbitmq handler in socker_handler")
        IO.inspect(x)

        {:reply,
         prepare_socket_msg(
           %{
             op: "error",
             d: "you should never see this, if you do, try refreshing"
           },
           state
         ), state}
    end
  end

  def f_handler(
        "get_follow_list",
        %{"username" => username, "isFollowing" => get_following_list, "cursor" => cursor},
        state
      ) do
    {users, next_cursor} =
      Kousa.Follow.get_follow_list_by_username(
        state.user_id,
        username,
        get_following_list,
        cursor
      )

    %{
      users: users,
      nextCursor: next_cursor
    }
  end

  def f_handler("get_invite_list", %{"cursor" => cursor}, state) do
    {users, next_cursor} = Follows.fetch_invite_list(state.user_id, cursor)

    %{users: users, nextCursor: next_cursor}
  end

  def f_handler("follow", %{"userId" => userId, "value" => value}, state) do
    Kousa.Follow.follow(state.user_id, userId, value)
    %{}
  end

  def f_handler("get_my_following", %{"cursor" => cursor}, state) do
    {users, next_cursor} = Follows.get_my_following(state.user_id, cursor)

    %{users: users, nextCursor: next_cursor}
  end

  def f_handler("mute", %{"value" => value}, state) do
    Onion.UserSession.set_mute(state.user_id, value)
    %{}
  end

  def f_handler("join_room_and_get_info", %{"roomId" => room_id_to_join}, state) do
    case Kousa.Room.join_room(state.user_id, room_id_to_join) do
      %{error: err} ->
        %{error: err}

      %{room: room} ->
        {room_id, users} = Beef.Users.get_users_in_current_room(state.user_id)

        case Onion.RoomSession.lookup(room_id) do
          [] ->
            %{error: "Room no longer exists."}

          _ ->
            {muteMap, autoSpeaker, activeSpeakerMap} =
              if room_id do
                Onion.RoomSession.get_maps(room_id)
              else
                {%{}, false, %{}}
              end

            %{
              room: room,
              users: users,
              muteMap: muteMap,
              activeSpeakerMap: activeSpeakerMap,
              roomId: room_id,
              autoSpeaker: autoSpeaker
            }
        end

      _ ->
        %{error: "you should never see this, tell ben"}
    end
  end

  def f_handler("get_current_room_users", _data, state) do
    {room_id, users} = Beef.Users.get_users_in_current_room(state.user_id)

    {muteMap, autoSpeaker, activeSpeakerMap} =
      if room_id do
        Onion.RoomSession.get_maps(room_id)
      else
        {%{}, false, %{}}
      end

    %{
      users: users,
      muteMap: muteMap,
      activeSpeakerMap: activeSpeakerMap,
      roomId: room_id,
      autoSpeaker: autoSpeaker
    }
  end

  @spec f_handler(<<_::64, _::_*8>>, any, atom | map) :: any
  def f_handler("get_my_scheduled_rooms_about_to_start", _data, state) do
    %{scheduledRooms: Kousa.ScheduledRoom.get_my_scheduled_rooms_about_to_start(state.user_id)}
  end

  def f_handler("get_top_public_rooms", data, state) do
    {rooms, next_cursor} =
      Rooms.get_top_public_rooms(
        state.user_id,
        data["cursor"]
      )

    %{rooms: rooms, nextCursor: next_cursor, initial: data["cursor"] == 0}
  end

  def f_handler(
        "edit_room",
        %{"name" => name, "description" => description, "privacy" => privacy},
        state
      ) do
    case Kousa.Room.edit_room(state.user_id, name, description, privacy == "private") do
      {:error, message} ->
        %{
          error: message
        }

      _ ->
        true
    end
  end

  def f_handler("get_scheduled_rooms", data, state) do
    {scheduled_rooms, next_cursor} =
      Kousa.ScheduledRoom.get_scheduled_rooms(
        state.user_id,
        Map.get(data, "getOnlyMyScheduledRooms") == true,
        Map.get(data, "cursor")
      )

    %{
      scheduledRooms: scheduled_rooms,
      nextCursor: next_cursor
    }
  end

  def f_handler("edit_scheduled_room", %{"id" => id, "data" => data}, state) do
    case Kousa.ScheduledRoom.edit(
           state.user_id,
           id,
           data
         ) do
      :ok ->
        %{}

      {:error, msg} ->
        %{error: msg}
    end
  end

  def f_handler("delete_scheduled_room", %{"id" => id}, state) do
    Kousa.ScheduledRoom.delete(
      state.user_id,
      id
    )

    %{}
  end

  def f_handler(
        "create_room_from_scheduled_room",
        %{
          "id" => scheduled_room_id,
          "name" => name,
          "description" => description
        },
        state
      ) do
    case Kousa.ScheduledRoom.create_room_from_scheduled_room(
           state.user_id,
           scheduled_room_id,
           name,
           description
         ) do
      {:ok, d} ->
        d

      {:error, d} ->
        %{
          error: d
        }
    end
  end

  def f_handler("schedule_room", data, state) do
    case Kousa.ScheduledRoom.schedule(state.user_id, data) do
      {:ok, scheduledRoom} ->
        %{scheduledRoom: scheduledRoom}

      {:error, msg} ->
        %{error: msg}
    end
  end

  def f_handler("unban_from_room", %{"userId" => user_id}, state) do
    Kousa.RoomBlock.unban(state.user_id, user_id)
    %{}
  end

  def f_handler("edit_profile", %{"data" => data}, state) do
    %{
      isUsernameTaken:
        case Kousa.User.edit_profile(state.user_id, data) do
          :username_taken -> true
          _ -> false
        end
    }
  end

  def f_handler("get_blocked_from_room_users", %{"offset" => offset}, state) do
    case Kousa.RoomBlock.get_blocked_users(state.user_id, offset) do
      {users, next_cursor} ->
        %{users: users, nextCursor: next_cursor}

      _ ->
        %{users: [], nextCursor: nil}
    end
  end

  def f_handler("get_user_profile", %{"userId" => id_or_username}, state) do
    case UUID.cast(id_or_username) do
      {:ok, uuid} ->
        Beef.Users.get_by_id_with_follow_info(state.user_id, uuid)

      _ ->
        Beef.Users.get_by_username_with_follow_info(state.user_id, id_or_username)
    end
  end

  def f_handler("follow_info", %{"userId" => other_user_id}, state) do
    Map.merge(
      %{userId: other_user_id},
      Follows.get_info(state.user_id, other_user_id)
    )
  end

  defp prepare_socket_msg(data, state) do
    data
    |> encode_data(state)
    |> prepare_data(state)
  end

  defp encode_data(data, %{encoding: :etf}) do
    data
    |> Map.from_struct()
    |> :erlang.term_to_binary()
  end

  defp encode_data(data, %{encoding: :json}) do
    Jason.encode!(data)
  end

  defp prepare_data(data, %{compression: :zlib}) do
    z = :zlib.open()

    :zlib.deflateInit(z)
    data = :zlib.deflate(z, data, :finish)
    :zlib.deflateEnd(z)

    {:binary, data}
  end

  defp prepare_data(data, %{encoding: :etf}) do
    {:binary, data}
  end

  defp prepare_data(data, %{encoding: :json}) do
    {:text, data}
  end
end
