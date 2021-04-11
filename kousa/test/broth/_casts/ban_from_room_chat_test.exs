defmodule KousaTest.Broth.BanFromRoomChatTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias Broth.WsClient
  alias Broth.WsClientFactory
  alias Kousa.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket chat_user_banned operation" do
    test "bans the person from the room chat", t do
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(t.user.id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a user that is logged in.
      banned = %{id: banned_id} = Factory.create(User)
      ws_banned = WsClientFactory.create_client_for(banned)

      # join the speaker user into the room
      Kousa.Room.join_room(banned_id, room_id)
      WsClient.assert_frame("new_user_join_room", _)

      WsClient.send_msg(t.client_ws, "ban_from_room_chat", %{userId: banned_id})
      WsClient.assert_frame("chat_user_banned", %{"userId" => ^banned_id}, t.client_ws)
      WsClient.assert_frame("chat_user_banned", %{"userId" => ^banned_id}, ws_banned)

      assert Onion.RoomChat.banned?(room_id, banned_id)
    end

    @tag :skip
    test "a non-mod can't ban someone from room chat"
  end
end
