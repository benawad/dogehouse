defmodule Broth.SocketHandler do
  require Logger

  alias Beef.Users
  alias Beef.Rooms
  alias Beef.Follows
  alias Ecto.UUID
  alias Beef.RoomPermissions
  alias Onion.UserSession

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
    Process.send_after(self(), {:finish_awaiting}, @auth_timeout)
    Process.put(:"$callers", state.callers)

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
            "reconnectToVoice" => reconnectToVoice,
            "muted" => muted
          } = json["d"]

          case Kousa.Utils.TokenUtils.tokens_to_user_id(accessToken, refreshToken) do
            {nil, nil} ->
              {:reply, {:close, 4001, "invalid_authentication"}, state}

            x ->
              {user_id, tokens, user} =
                case x do
                  {user_id, tokens} -> {user_id, tokens, Beef.Users.get_by_id(user_id)}
                  y -> y
                end

              if user do
                # note that this will start the session and will be ignored if the
                # session is already running.
                UserSession.start_supervised(
                  user_id: user_id,
                  username: user.username,
                  avatar_url: user.avatarUrl,
                  display_name: user.displayName,
                  current_room_id: user.currentRoomId,
                  muted: muted
                )

                UserSession.set_pid(user_id, self())

                if tokens do
                  UserSession.new_tokens(user_id, tokens)
                end

                roomIdFromFrontend = Map.get(json["d"], "currentRoomId", nil)

                currentRoom =
                  cond do
                    not is_nil(user.currentRoomId) ->
                      # @todo this should probably go inside room business logic
                      room = Rooms.get_room_by_id(user.currentRoomId)

                      Onion.RoomSession.start_supervised(
                        room_id: user.currentRoomId,
                        voice_server_id: room.voiceServerId
                      )

                      Onion.RoomSession.join_room(room.id, user.id, muted)

                      if reconnectToVoice == true do
                        Kousa.Room.join_vc_room(user.id, room)
                      end

                      room

                    not is_nil(roomIdFromFrontend) ->
                      case Kousa.Room.join_room(user.id, roomIdFromFrontend) do
                        %{room: room} -> room
                        _ -> nil
                      end

                    true ->
                      nil
                  end

                {:reply,
                 construct_socket_msg(state.encoding, state.compression, %{
                   op: "auth-good",
                   d: %{user: user, currentRoom: currentRoom}
                 }), %{state | user_id: user_id, awaiting_init: false}}
              else
                {:reply, {:close, 4001, "invalid_authentication"}, state}
              end
          end

        _ ->
          if not is_nil(state.user_id) do
            try do
              case json do
                %{"op" => op, "d" => d, "fetchId" => fetch_id} ->
                  {:reply,
                   prepare_socket_msg(
                     %{
                       op: "fetch_done",
                       d: f_handler(op, d, state),
                       fetchId: fetch_id
                     },
                     state
                   ), state}

                %{"op" => op, "d" => d} ->
                  handler(op, d, state)
              end
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
            catch
              _, e ->
                err_msg = Kernel.inspect(e)
                IO.puts(err_msg)
                Logger.error(Exception.format_stacktrace())

                op = Map.get(json, "op", "")
                IO.puts("error for op: " <> op)

                Sentry.capture_message(err_msg,
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

  # @deprecated in new design
  def handler("fetch_following_online", %{"cursor" => cursor}, state) do
    {users, next_cursor} = Follows.get_my_following(state.user_id, cursor)

    {:reply,
     construct_socket_msg(state.encoding, state.compression, %{
       op: "fetch_following_online_done",
       d: %{users: users, nextCursor: next_cursor, initial: cursor == 0}
     }), state}
  end

  def handler("invite_to_room", %{"userId" => user_id_to_invite}, state) do
    Kousa.Room.invite_to_room(state.user_id, user_id_to_invite)
    {:ok, state}
  end

  def handler("make_room_public", %{"newName" => new_name}, state) do
    Kousa.Room.make_room_public(state.user_id, new_name)
    {:ok, state}
  end

  # @deprecated in new design
  def handler("fetch_invite_list", data, state) do
    {:reply,
     construct_socket_msg(state.encoding, state.compression, %{
       op: "fetch_invite_list_done",
       d: f_handler("get_invite_list", data, state)
     }), state}
  end

  def handler("ban", %{"username" => username, "reason" => reason}, state) do
    worked = Kousa.User.ban(state.user_id, username, reason)

    {:reply,
     construct_socket_msg(state.encoding, state.compression, %{
       op: "ban_done",
       d: %{worked: worked}
     }), state}
  end

  def handler("set_auto_speaker", %{"value" => value}, state) do
    Kousa.Room.set_auto_speaker(state.user_id, value)

    {:ok, state}
  end

  # @deprecated
  def handler("create-room", data, state) do
    resp =
      case Kousa.Room.create_room(
             state.user_id,
             data["roomName"],
             data["description"] || "",
             data["value"] == "private",
             Map.get(data, "userIdToInvite")
           ) do
        {:ok, d} ->
          %{
            op: "new_current_room",
            d: d
          }

        {:error, d} ->
          %{
            op: "error",
            d: d
          }
      end

    {:reply,
     construct_socket_msg(
       state.encoding,
       state.compression,
       resp
     ), state}
  end

  # @deprecated
  def handler("get_top_public_rooms", data, state) do
    {:reply,
     construct_socket_msg(state.encoding, state.compression, %{
       op: "get_top_public_rooms_done",
       d: f_handler("get_top_public_rooms", data, state)
     }), state}
  end

  def handler("speaking_change", %{"value" => value}, state) do
    if current_room_id = Beef.Users.get_current_room_id(state.user_id) do
      Onion.RoomSession.speaking_change(current_room_id, state.user_id, value)
    end

    {:ok, state}
  end

  # @deprecated
  def handler("edit_room_name", %{"name" => name}, state) do
    case Kousa.Room.edit_room(state.user_id, name, "", false) do
      {:error, message} ->
        {:reply, prepare_socket_msg(%{op: "error", d: message}, state), state}

      _ ->
        {:ok, state}
    end
  end

  def handler("leave_room", _data, state) do
    case Kousa.Room.leave_room(state.user_id) do
      {:ok, d} ->
        {:reply, prepare_socket_msg(%{op: "you_left_room", d: d}, state), state}

      _ ->
        {:ok, state}
    end
  end

  # @deprecated in new design
  def handler("join_room", %{"roomId" => room_id}, state) do
    case Kousa.Room.join_room(state.user_id, room_id) do
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

  def handler("send_room_chat_msg", %{"tokens" => tokens, "whisperedTo" => whispered_to}, state) do
    Kousa.RoomChat.send_msg(state.user_id, tokens, whispered_to)
    {:ok, state}
  end

  def handler("send_room_chat_msg", %{"tokens" => tokens}, state) do
    Kousa.RoomChat.send_msg(state.user_id, tokens, [])
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
    Kousa.Room.set_listener(state.user_id, user_id_to_make_listener)
    {:ok, state}
  end

  # deprecated??
  def handler("follow_info", %{"userId" => other_user_id}, state) do
    {:reply,
     construct_socket_msg(state.encoding, state.compression, %{
       op: "follow_info_done",
       d:
         Map.merge(
           %{userId: other_user_id},
           Follows.get_info(state.user_id, other_user_id)
         )
     }), state}
  end

  def handler("mute", %{"value" => value}, state) do
    Onion.UserSession.set_mute(state.user_id, value)
    {:ok, state}
  end

  # @deprecated in new design
  def handler("get_current_room_users", data, state) do
    {:reply,
     prepare_socket_msg(
       %{
         op: "get_current_room_users_done",
         d: f_handler("get_current_room_users", data, state)
       },
       state
     ), state}
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

  def f_handler("create_room", data, state) do
    case Kousa.Room.create_room(
           state.user_id,
           data["name"],
           data["description"],
           data["privacy"] == "private",
           Map.get(data, "userIdToInvite")
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

  defp prepare_socket_msg(data, %{compression: compression, encoding: encoding}) do
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
