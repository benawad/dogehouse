defmodule KousaTest.Broth.Ws.BlockFromRoomTest do
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
    ws_client = WsClientFactory.create_client_for(user)

    {:ok, user: user, ws_client: ws_client}
  end

  describe "the websocket block_from_room operation" do
    test "blocks that person from a room", t do
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(t.user.id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a blocked user that is logged in.
      blocked = %{id: blocked_id} = Factory.create(User)
      WsClientFactory.create_client_for(blocked)

      # join the blocked user into the room
      Kousa.Room.join_room(blocked_id, room_id)

      # block the person.
      WsClient.send_msg(t.ws_client, "block_from_room", %{"userId" => blocked_id})

      WsClient.assert_frame(
        "user_left_room", %{"roomId" => ^room_id, "userId" => ^blocked_id})

      # note this comes from the follower's client
      assert Beef.RoomBlocks.blocked?(room_id, blocked_id)
    end
  end
end
