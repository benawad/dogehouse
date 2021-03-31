defmodule KousaTest.Broth.GetTopPublicRoomsTest do
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

  describe "the websocket get_top_public_rooms operation" do
    test "returns one public room if it's the only one", t do
      user_id = t.user.id
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(user_id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)

      ref =
        WsClient.send_call(
          t.client_ws,
          "get_top_public_rooms",
          %{}
        )

      WsClient.assert_reply(
        ref,
        %{"rooms" => [%{"id" => ^room_id}]},
        t.client_ws
      )
    end

    test "doesn't return a room if it's private", t do
      user_id = t.user.id
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(user_id, "foo room", "foo", true)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)

      ref =
        WsClient.send_call(
          t.client_ws,
          "get_top_public_rooms",
          %{}
        )

      WsClient.assert_reply(
        ref,
        %{"rooms" => []},
        t.client_ws
      )
    end

    @tag :skip
    test "when there's more than one room"

    @tag :skip
    test "cursors also work"

    @tag :skip
    test "there is a maximum limit to the cursor"
  end
end
