defmodule BrothTest.Room.MuteTest do
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

    %{"id" => room_id} =
      WsClient.do_call(
        client_ws,
        "room:create",
        %{"name" => "foo room", "description" => "foo"}
      )

    {:ok, user: user, client_ws: client_ws, room_id: room_id}
  end

  describe "the websocket room:mute operation" do
    test "can be used to mute", t do
      # first, create a room owned by the primary user.
      room_id = t.room_id
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # mute ON
      ref = WsClient.send_call(t.client_ws, "room:mute", %{"muted" => true})
      WsClient.assert_reply("room:mute:reply", ref, _)
      Process.sleep(100)
      map = Onion.RoomSession.get(room_id, :muteMap)
      assert is_map_key(map, t.user.id)

      # mute OFF
      ref = WsClient.send_call(t.client_ws, "room:mute", %{"muted" => false})
      WsClient.assert_reply("room:mute:reply", ref, _)
      Process.sleep(100)
      map = Onion.RoomSession.get(room_id, :muteMap)
      refute is_map_key(map, t.user.id)
    end

    test "can be used to unmute", t do
      # first, create a room owned by the primary user.
      room_id = t.room_id
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      ref = WsClient.send_call(t.client_ws, "room:mute", %{"muted" => false})

      WsClient.assert_reply("room:mute:reply", ref, _)

      map = Onion.RoomSession.get(room_id, :muteMap)

      assert map == %{}
    end
  end
end
