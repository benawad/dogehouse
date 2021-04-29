defmodule BrothTest.MuteTest do
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

  describe "the websocket mute call operation" do
    test "can be used to swap state", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      WsClient.send_call_legacy(t.client_ws, "mute", %{"value" => true})

      # obtain the pseudo-response
      assert_receive({:text, _, _})

      Process.sleep(100)

      map = Onion.RoomSession.get(room_id, :muteMap)

      assert is_map_key(map, t.user.id)

      WsClient.send_call_legacy(t.client_ws, "mute", %{"value" => false})

      # obtain the pseudo-response
      assert_receive({:text, _, _})
      Process.sleep(100)

      map = Onion.RoomSession.get(room_id, :muteMap)
      refute is_map_key(map, t.user.id)
    end

    test "has no effect on initial value", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      WsClient.send_call_legacy(t.client_ws, "mute", %{"value" => false})

      # obtain the pseudo-response
      assert_receive({:text, _, _})
      assert %{} == Onion.RoomSession.get(room_id, :muteMap)
    end
  end
end
