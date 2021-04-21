defmodule BrothTest.Room.DeafenTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias BrothTest.WsClient
  alias BrothTest.WsClientFactory
  alias KousaTest.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket room:deafen operation" do
    test "can be used to deafen", t do
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(t.user.id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # deaf ON
      ref = WsClient.send_call(t.client_ws, "room:deafen", %{"deafen" => true})
      WsClient.assert_reply("room:deafen:reply", ref, _)
      Process.sleep(100)
      map = Onion.RoomSession.get(room_id, :deafMap)
      assert is_map_key(map, t.user.id)

      # deaf OFF
      ref = WsClient.send_call(t.client_ws, "room:deafen", %{"deafen" => false})
      WsClient.assert_reply("room:deafen:reply", ref, _)
      Process.sleep(100)
      map = Onion.RoomSession.get(room_id, :deafMap)
      refute is_map_key(map, t.user.id)
    end

    test "can be used to undeafen", t do
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(t.user.id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      ref = WsClient.send_call(t.client_ws, "room:deafen", %{"deafen" => false})

      WsClient.assert_reply("room:deafen:reply", ref, _)

      map = Onion.RoomSession.get(room_id, :deafMap)

      assert map == %{}
    end
  end
end
