defmodule Kousa.Auth do
  alias Onion.PubSub

  alias Kousa.Utils.TokenUtils

  @spec authenticate(Broth.Message.Auth.Request.t(), IP.addr()) ::
          {:ok, Beef.Schemas.User.t()} | {:error, term}
  def authenticate(request, ip) do
    case TokenUtils.tokens_to_user_id(request.accessToken, request.refreshToken) do
      nil ->
        {:error, "invalid_authentication"}

      {:existing_claim, user_id} ->
        do_auth(Beef.Users.get(user_id), nil, request, ip)

      # TODO: streamline this since we're duplicating user_id and user.
      {:new_tokens, _user_id, tokens, user} ->
        do_auth(user, tokens, request, ip)
    end
  end

  defp do_auth(user, tokens, request, ip) do
    alias Onion.UserSession
    alias Onion.RoomSession
    alias Beef.Rooms

    if user do
      # note that this will start the session and will be ignored if the
      # session is already running.
      UserSession.start_supervised(
        user_id: user.id,
        ip: ip,
        username: user.username,
        avatar_url: user.avatarUrl,
        banner_url: user.bannerUrl,
        display_name: user.displayName,
        current_room_id: user.currentRoomId,
        muted: request.muted,
        deafened: request.deafened,
        bot_owner_id: user.botOwnerId
      )

      if user.ip != ip do
        Beef.Users.set_ip(user.id, ip)
      end

      # currently we only allow one active websocket connection per-user
      # at some point soon we're going to make this multi-connection, and we
      # won't have to do this.
      UserSession.set_active_ws(user.id, self())

      if tokens do
        UserSession.new_tokens(user.id, tokens)
      end

      roomIdFromFrontend = request.currentRoomId

      cond do
        user.currentRoomId ->
          # TODO: move toroom business logic
          room = Rooms.get_room_by_id(user.currentRoomId)

          RoomSession.start_supervised(
            room_id: user.currentRoomId,
            voice_server_id: room.voiceServerId,
            chat_mode: room.chatMode,
            room_creator_id: room.creatorId
          )

          PubSub.subscribe("chat:" <> room.id)
          RoomSession.join_room(room.id, user.id, request.muted, request.deafened)

          if request.reconnectToVoice == true do
            Kousa.Room.join_vc_room(user.id, room)
          end

        roomIdFromFrontend ->
          Kousa.Room.join_room(user.id, roomIdFromFrontend)

        true ->
          :ok
      end

      # subscribe to chats directed to oneself.
      PubSub.subscribe("chat:" <> user.id)
      # subscribe to user updates
      PubSub.subscribe("user:update:" <> user.id)

      {:ok, user}
    else
      {:close, 4001, "invalid_authentication"}
    end
  end
end
