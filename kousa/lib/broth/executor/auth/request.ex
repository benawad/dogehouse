defimpl Broth.Executor, for: Broth.Message.Auth.Request do
  alias Beef.Rooms
  alias Onion.UserSession
  alias Broth.Message.Auth.Request.Reply

  #def execute(request = %{accessToken: accessToken, refreshToken: refreshToken}, state) do
  #  case Kousa.Utils.TokenUtils.tokens_to_user_id(accessToken, refreshToken) do
  #    nil ->
  #      {:close, 4001, "invalid_authentication"}
#
  #    {:existing_claim, user_id} ->
  #      do_auth(user_id, nil, Beef.Users.get_by_id(user_id), request, state)
#
  #    {:new_tokens, user_id, tokens, user} ->
  #      do_auth(user_id, tokens, user, request, state)
  #  end
  #end

  #defp do_auth(user_id, tokens, user, request, state) do
  #  if user do
  #    # note that this will start the session and will be ignored if the
  #    # session is already running.
  #    UserSession.start_supervised(
  #      user_id: user_id,
  #      username: user.username,
  #      avatar_url: user.avatarUrl,
  #      display_name: user.displayName,
  #      current_room_id: user.currentRoomId,
  #      muted: request.muted
  #    )
#
  #    UserSession.set_pid(user_id, self())
#
  #    if tokens do
  #      UserSession.new_tokens(user_id, tokens)
  #    end
#
  #    roomIdFromFrontend = request.currentRoomId
#
  #    currentRoom =
  #      cond do
  #        user.currentRoomId ->
  #          # @todo this should probably go inside room business logic
  #          room = Rooms.get_room_by_id(user.currentRoomId)
#
  #          Onion.RoomSession.start_supervised(
  #            room_id: user.currentRoomId,
  #            voice_server_id: room.voiceServerId
  #          )
#
  #          Onion.RoomSession.join_room(room.id, user, request.muted)
#
  #          if request.reconnectToVoice == true do
  #            Kousa.Room.join_vc_room(user.id, room)
  #          end
#
  #          room
#
  #        roomIdFromFrontend ->
  #          case Kousa.Room.join_room(user.id, roomIdFromFrontend) do
  #            %{room: room} -> room
  #            _ -> nil
  #          end
#
  #        true ->
  #          nil
  #      end
#
  #    {:reply, %Reply{user: user, currentRoom: currentRoom},
  #     %{state | user_id: user_id, awaiting_init: false}}
  #  else
  #    {:close, 4001, "invalid authentication"}
  #  end
  #end
end
