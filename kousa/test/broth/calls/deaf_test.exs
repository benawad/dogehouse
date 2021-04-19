defmodule KousaTest.Broth.DeafTest do
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

  describe "the websocket deaf call operation" do
    test "can be used to deafen", t do
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(t.user.id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      ref = WsClient.send_call(t.client_ws, "deafen", %{"value" => true})

      WsClient.assert_reply(ref, _)

      # TODO: do a test to check to make sure the muted state is correct
    end

    test "can be used to undeafen", t do
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(t.user.id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      ref = WsClient.send_call(t.client_ws, "deafen", %{"value" => false})

      WsClient.assert_reply(ref, _)

      # TODO: do a test to check to make sure the muted state is correct
    end
  end
end
