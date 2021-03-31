defmodule KousaTest.Broth.EditRoomTest do
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

  describe "the websocket edit_room operation" do
    test "changes the name of the room you're in", t do
      user_id = t.user.id
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(user_id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)

      ref =
        WsClient.send_call(
          t.client_ws,
          "edit_room",
          %{"name" => "bar room", "description" => "baz quux", "privacy" => "private"}
        )

      WsClient.assert_reply(
        ref,
        true,
        t.client_ws
      )

      WsClient.assert_frame(
        "new_room_details",
        %{
          "description" => "baz quux",
          "isPrivate" => true,
          "name" => "bar room",
          "roomId" => ^room_id
        }
      )

      # TODO: make sure that privacy is actually
      assert %{
               isPrivate: _,
               description: "baz quux",
               name: "bar room"
             } = Beef.Rooms.get_room_by_id(room_id)
    end

    @tag :skip
    test "when you're not in a room", t do
      ref =
        WsClient.send_call(
          t.client_ws,
          "edit_room",
          %{}
        )

      WsClient.assert_reply(
        ref,
        _,
        t.client_ws
      )
    end

    @tag :skip
    test "errors when you aren't the creator of the room"

    @tag :skip
    test "when the room doesn't exist"
  end
end
