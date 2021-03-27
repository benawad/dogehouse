defmodule KousaTest.Broth.Ws.MakeRoomPublicTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias Beef.Rooms
  alias Broth.WsClient
  alias Broth.WsClientFactory
  alias Kousa.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    ws_client = WsClientFactory.create_client_for(user)

    {:ok, user: user, ws_client: ws_client}
  end

  describe "the websocket make_room_public operation" do
    test "makes the room public", t do
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(t.user.id, "foo room", "foo", true)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)
      # make sure the room is private

      assert Rooms.get_room_by_id(room_id).isPrivate

      WsClient.send_msg(t.ws_client, "make_room_public", %{"newName" => "quux room"})

      WsClient.assert_frame("room_privacy_change", %{"name" => "quux room", "isPrivate" => false})

      # make sure the room is actually private
      assert %{
               isPrivate: false,
               name: "quux room"
             } = Rooms.get_room_by_id(room_id)
    end
  end
end
