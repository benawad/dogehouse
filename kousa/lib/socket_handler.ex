defmodule Kousa.SocketHandler do
  require Logger

  alias Kousa.{BL}

  defmodule State do
    @type t :: %__MODULE__{
            awaiting_init: boolean(),
            user_id: String.t(),
            encoding: atom(),
            compression: String.t()
          }

    defstruct awaiting_init: true,
              user_id: nil,
              platform: nil,
              encoding: nil,
              compression: nil
  end

  @behaviour :cowboy_websocket

  def init(request, _state) do
    compression =
      request
      |> :cowboy_req.parse_qs()
      |> Enum.find(fn {name, _value} -> name == "compression" end)
      |> case do
        {_name, "zlib_json"} -> :zlib
        {_name, "zlib"} -> :zlib
        _ -> :json
      end

    encoding =
      request
      |> :cowboy_req.parse_qs()
      |> Enum.find(fn {name, _value} -> name == "encoding" end)
      |> case do
        {_name, "etf"} -> :etf
        _ -> :json
      end

    state = %State{
      awaiting_init: true,
      user_id: nil,
      encoding: encoding,
      compression: compression
    }

    {:cowboy_websocket, request, state}
  end

  def websocket_init(state) do
    Process.send_after(self(), {:finish_awaiting}, 10_000)

    {:ok, state}
  end

  def websocket_info({:finish_awaiting}, state) do
    if state.awaiting_init do
      {:stop, state}
    else
      {:ok, state}
    end
  end

  def websocket_info({:remote_send, message}, state) do
    {:reply, construct_socket_msg(state.encoding, state.compression, message), state}
  end

  def websocket_info({:send_to_linked_session, message}, state) do
    send(state.linked_session, message)
    {:ok, state}
  end

  def websocket_info({:kill}, state) do
    {:reply, {:close, 4003, "killed_by_server"}, state}
  end

  def websocket_handle({:text, "ping"}, state) do
    {:reply, construct_socket_msg(state.encoding, state.compression, "pong"), state}
  end

  def websocket_handle({:ping, _}, state) do
    {:reply, construct_socket_msg(state.encoding, state.compression, "pong"), state}
  end

  def websocket_handle({:text, json}, state) do
    with {:ok, json} <- Poison.decode(json) do
      case json["op"] do
        "auth" ->
          %{
            "accessToken" => accessToken,
            "refreshToken" => refreshToken,
            "platform" => platform,
            "reconnectToVoice" => reconnectToVoice,
            "muted" => muted
          } = json["d"]

          case Kousa.TokenUtils.tokens_to_user_id(accessToken, refreshToken) do
            {nil, nil} ->
              {:reply, {:close, 4001, "invalid_authentication"}, state}

            x ->
              {user_id, tokens, user} =
                case x do
                  {user_id, tokens} -> {user_id, tokens, Kousa.Data.User.get_by_id(user_id)}
                  y -> y
                end

              cond do
                user ->
                  {:ok, session} =
                    GenRegistry.lookup_or_start(Kousa.Gen.UserSession, user_id, [
                      %Kousa.Gen.UserSession.State{
                        user_id: user_id,
                        avatar_url: user.avatarUrl,
                        display_name: user.displayName,
                        current_room_id: user.currentRoomId,
                        muted: muted
                      }
                    ])

                  GenServer.call(session, {:set_pid, self()})

                  if tokens do
                    GenServer.cast(session, {:new_tokens, tokens})
                  end

                  if not is_nil(user.currentRoomId) do
                    {:ok, room_session} =
                      GenRegistry.lookup_or_start(Kousa.Gen.RoomSession, user.currentRoomId, [
                        %{user_id: user_id, room_id: user.currentRoomId, muted: muted}
                      ])

                    GenServer.cast(
                      room_session,
                      {:join_room, user, muted}
                    )

                    if reconnectToVoice == true do
                      Kousa.BL.Room.join_vc_room(user.id, user.currentRoomId)
                    end
                  end

                  {:reply,
                   construct_socket_msg(state.encoding, state.compression, %{
                     op: "auth-good",
                     d: %{user: user}
                   }), %{state | user_id: user_id, awaiting_init: false, platform: platform}}

                true ->
                  {:reply, {:close, 4001, "invalid_authentication"}, state}
              end
          end

        _ ->
          if not is_nil(state.user_id) do
            try do
              handler(json["op"], json["d"], state)
            rescue
              e ->
                err_msg = Exception.message(e)

                IO.inspect(e)
                Logger.error(err_msg)
                Logger.error(Exception.format_stacktrace())
                op = Map.get(json, "op", "")
                IO.puts("error for op: " <> op)

                Sentry.capture_exception(e,
                  stacktrace: __STACKTRACE__,
                  extra: %{op: op}
                )

                {:reply,
                 construct_socket_msg(state.encoding, state.compression, %{
                   op: "error",
                   d: err_msg
                 }), state}
            end
          else
            {:reply, {:close, 4004, "not_authenticated"}, state}
          end
      end
    end
  end

  defp construct_socket_msg(encoding, compression, data) do
    data =
      case encoding do
        :etf ->
          data

        _ ->
          data |> Poison.encode!()
      end

    case compression do
      :zlib ->
        z = :zlib.open()
        :zlib.deflateInit(z)

        data = :zlib.deflate(z, data, :finish)

        :zlib.deflateEnd(z)

        {:binary, data}

      _ ->
        {:text, data}
    end
  end

  # def handler("join-as-new-peer", _data, state) do
  #   Kousa.BL.Room.join_vc_room(state.user_id)
  #   {:ok, state}
  # end

  def handler("fetch_following_online", %{"cursor" => cursor}, state) do
    {users, next_cursor} = Kousa.Data.Follower.fetch_following_online(state.user_id, cursor)

    {:reply,
     construct_socket_msg(state.encoding, state.compression, %{
       op: "fetch_following_online_done",
       d: %{users: users, nextCursor: next_cursor, initial: cursor == 0}
     }), state}
  end

  def handler("invite_to_room", %{"userId" => user_id_to_invite}, state) do
    Kousa.BL.Room.invite_to_room(state.user_id, user_id_to_invite)
    {:ok, state}
  end

  def handler("make_room_public", %{"newName" => new_name}, state) do
    Kousa.BL.Room.make_room_public(state.user_id, new_name)
    {:ok, state}
  end

  def handler("fetch_invite_list", %{"cursor" => cursor}, state) do
    {users, next_cursor} = Kousa.Data.Follower.fetch_invite_list(state.user_id, cursor)

    {:reply,
     construct_socket_msg(state.encoding, state.compression, %{
       op: "fetch_invite_list_done",
       d: %{users: users, nextCursor: next_cursor, initial: cursor == 0}
     }), state}
  end

  def handler("ban", %{"username" => username, "reason" => reason}, state) do
    worked = Kousa.BL.User.ban(state.user_id, username, reason)

    {:reply,
     construct_socket_msg(state.encoding, state.compression, %{
       op: "ban_done",
       d: %{worked: worked}
     }), state}
  end

  def handler("set_auto_speaker", %{"value" => value}, state) do
    Kousa.BL.Room.set_auto_speaker(state.user_id, value)

    {:ok, state}
  end

  def handler("create-room", data, state) do
    case Kousa.BL.Room.create_room(state.user_id, data["roomName"], data["value"] == "private") do
      nil ->
        nil

      {:ok, d} ->
        if Map.has_key?(data, "userIdToInvite") do
          Kousa.BL.Room.invite_to_room(state.user_id, data["userIdToInvite"])
        end

        {:reply,
         construct_socket_msg(state.encoding, state.compression, %{
           op: "new_current_room",
           d: d
         }), state}

      {:error, d} ->
        {:reply,
         construct_socket_msg(state.encoding, state.compression, %{
           op: "error",
           d: d
         }), state}
    end
  end

  def handler("get_top_public_rooms", data, state) do
    {rooms, next_cursor} =
      Kousa.Data.Room.get_top_public_rooms(
        state.user_id,
        data["cursor"]
      )

    {:reply,
     construct_socket_msg(state.encoding, state.compression, %{
       op: "get_top_public_rooms_done",
       d: %{rooms: rooms, nextCursor: next_cursor, initial: data["cursor"] == 0}
     }), state}
  end

  def handler("speaking_change", %{"value" => value}, state) do
    current_room_id = Kousa.Data.User.get_current_room_id(state.user_id)

    if not is_nil(current_room_id) do
      Kousa.RegUtils.lookup_and_cast(
        Kousa.Gen.RoomSession,
        current_room_id,
        {:speaking_change, state.user_id, value}
      )
    end

    {:ok, state}
  end

  def handler("edit_room_name", %{"name" => name}, state) do
    case BL.Room.rename_room(state.user_id, name) do
      {:error, message} ->
        {:reply, prepare_socket_msg(%{op: "error", d: message}, state), state}

      _ ->
        {:ok, state}
    end
  end

  def handler("leave_room", _data, state) do
    Kousa.BL.Room.leave_room(state.user_id)

    {:ok, state}
  end

  def handler("join_room", %{"roomId" => room_id}, state) do
    case Kousa.BL.Room.join_room(state.user_id, room_id) do
      nil ->
        nil

      d ->
        {:reply,
         construct_socket_msg(state.encoding, state.compression, %{
           op: "join_room_done",
           d: d
         }), state}
    end
  end

  def handler(
        "block_from_room",
        %{"userId" => user_id_to_block_from_room},
        state
      ) do
    Kousa.BL.Room.block_from_room(state.user_id, user_id_to_block_from_room)
    {:ok, state}
  end

  def handler("add_speaker_from_hand", %{"userId" => user_id_to_make_speaker}, state) do
    Kousa.BL.Room.make_speaker(state.user_id, user_id_to_make_speaker, true)

    {:ok, state}
  end

  def handler("add_speaker", %{"userId" => user_id_to_make_speaker}, state) do
    Kousa.BL.Room.make_speaker(state.user_id, user_id_to_make_speaker)
    {:ok, state}
  end

  def handler("change_mod_status", %{"userId" => user_id_to_change, "value" => value}, state) do
    Kousa.BL.Room.change_mod(state.user_id, user_id_to_change, value)
    {:ok, state}
  end

  def handler("block_user_and_from_room", %{"userId" => user_id_to_block}, state) do
    Kousa.BL.UserBlock.block(state.user_id, user_id_to_block)
    Kousa.BL.Room.block_from_room(state.user_id, user_id_to_block)
    {:ok, state}
  end

  def handler("ban_from_room_chat", %{"userId" => user_id_to_ban}, state) do
    Kousa.BL.RoomChat.ban_user(state.user_id, user_id_to_ban)
    {:ok, state}
  end

  def handler("send_room_chat_msg", %{"tokens" => tokens}, state) do
    Kousa.BL.RoomChat.send_msg(state.user_id, tokens)
    {:ok, state}
  end

  def handler("follow", %{"userId" => userId, "value" => value}, state) do
    Kousa.BL.Follow.follow(state.user_id, userId, value)
    {:ok, state}
  end

  def handler(
        "fetch_follow_list",
        %{"userId" => user_id, "isFollowing" => get_following_list, "cursor" => cursor},
        state
      ) do
    {users, next_cursor} =
      Kousa.BL.Follow.get_follow_list(state.user_id, user_id, get_following_list, cursor)

    {:reply,
     construct_socket_msg(state.encoding, state.compression, %{
       op: "fetch_follow_list_done",
       d: %{
         isFollowing: get_following_list,
         userId: user_id,
         users: users,
         nextCursor: next_cursor,
         initial: cursor == 0
       }
     }), state}
  end

  def handler("set_listener", %{"userId" => user_id_to_make_listener}, state) do
    Kousa.BL.Room.set_listener(state.user_id, user_id_to_make_listener)
    {:ok, state}
  end

  def handler("follow_info", %{"userId" => other_user_id}, state) do
    {:reply,
     construct_socket_msg(state.encoding, state.compression, %{
       op: "follow_info_done",
       d:
         Map.merge(
           %{userId: other_user_id},
           Kousa.Data.Follower.get_info(state.user_id, other_user_id)
         )
     }), state}
  end

  def handler("mute", %{"value" => value}, state) do
    Kousa.Gen.UserSession.send_cast(state.user_id, {:set_mute, value})
    # user = Kousa.Data.User.get_by_id(state.user_id)

    # if not is_nil(user.currentRoomId) do
    #   Kousa.RegUtils.lookup_and_cast(
    #     Kousa.Gen.RoomSession,
    #     user.currentRoomId,
    #     {:mute, user.id, value}
    #   )

    #   # @todo if it came from vscode then send ws message
    #   # Kousa.RegUtils.lookup_and_cast(
    #   #   Kousa.Gen.UserSession,
    #   #   user.id,
    #   #   {:send_ws_msg, :web, %{op: "mute_changed", d: %{value: value}}}
    #   # )
    # end

    {:ok, state}
  end

  def handler("get_current_room_users", _data, state) do
    {room_id, users} = Kousa.Data.User.get_users_in_current_room(state.user_id)

    {muteMap, raiseHandMap, autoSpeaker} =
      cond do
        not is_nil(room_id) ->
          case GenRegistry.lookup(Kousa.Gen.RoomSession, room_id) do
            {:ok, session} ->
              GenServer.call(session, {:get_maps})

            _ ->
              {%{}, %{}, false}
          end

        true ->
          {%{}, %{}, false}
      end

    {:reply,
     construct_socket_msg(state.encoding, state.compression, %{
       op: "get_current_room_users_done",
       d: %{
         users: users,
         muteMap: muteMap,
         raiseHandMap: raiseHandMap,
         roomId: room_id,
         autoSpeaker: autoSpeaker
       }
     }), state}
  end

  def handler("decline_hand", %{"userId" => userId}, state) do
    room = Kousa.Data.Room.get_room_by_creator_id(state.user_id)

    if not is_nil(room) do
      Kousa.RegUtils.lookup_and_cast(
        Kousa.Gen.RoomSession,
        room.id,
        {:answer_hand, userId, 0}
      )
    end

    {:ok, state}
  end

  def handler("ask_to_speak", _data, state) do
    user = Kousa.Data.User.get_by_id(state.user_id)

    if not is_nil(user.currentRoomId) do
      case Kousa.RegUtils.lookup_and_call(
             Kousa.Gen.RoomSession,
             user.currentRoomId,
             {:raise_hand, user.id}
           ) do
        {:ok, :speaker} ->
          Kousa.BL.Room.internal_set_speaker(state.user_id, false, user.currentRoomId)

        _ ->
          nil
      end
    end

    {:ok, state}
  end

  def handler("audio_autoplay_error", _data, state) do
    Kousa.RegUtils.lookup_and_cast(
      Kousa.Gen.UserSession,
      state.user_id,
      {:send_ws_msg, :vscode,
       %{
         op: "error",
         d: "browser can't autoplay audio the first time, go press play audio in your browser"
       }}
    )

    {:ok, state}
  end

  def handler(op, data, state) do
    # @todo error handling null roomId
    d =
      cond do
        String.first(op) == "@" ->
          roomId = Kousa.Data.User.get_by_id(state.user_id).currentRoomId

          Map.merge(data, %{
            peerId: state.user_id,
            roomId: roomId
          })

        true ->
          data
      end

    Kousa.Gen.Rabbit.send(%{
      op: op,
      d: d,
      uid: state.user_id
    })

    {:ok, state}
  end

  defp prepare_socket_msg(data, %State{compression: compression, encoding: encoding}) do
    data
    |> encode_data(encoding)
    |> compress_data(compression)
  end

  defp encode_data(data, :etf) do
    data
  end

  defp encode_data(data, _encoding) do
    data |> Poison.encode!()
  end

  defp compress_data(data, :zlib) do
    z = :zlib.open()

    :zlib.deflateInit(z)
    data = :zlib.deflate(z, data, :finish)
    :zlib.deflateEnd(z)

    {:binary, data}
  end

  defp compress_data(data, _compression) do
    {:text, data}
  end
end
