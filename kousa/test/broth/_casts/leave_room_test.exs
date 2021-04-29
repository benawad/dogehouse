defmodule BrothTest.LeaveRoomTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias Beef.Rooms
  alias BrothTest.WsClient
  alias BrothTest.WsClientFactory
  alias KousaTest.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket leave_room operation" do
    test "deletes the room if they are the only person", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      assert Users.get_by_id(t.user.id).currentRoomId == room_id

      WsClient.send_msg_legacy(t.client_ws, "leave_room", %{})

      WsClient.assert_frame_legacy("you_left_room", _)

      refute Users.get_by_id(t.user.id).currentRoomId
      refute Rooms.get_room_by_id(room_id)
    end

    test "removes the person from the room if they aren't the only person", t do
      user_id = t.user.id

      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      other = Factory.create(User)
      other_ws = WsClientFactory.create_client_for(other)

      assert %{peoplePreviewList: [_]} = Rooms.get_room_by_id(room_id)

      WsClient.do_call(other_ws, "room:join", %{"roomId" => room_id})

      assert %{peoplePreviewList: [_, _]} = Rooms.get_room_by_id(room_id)

      WsClient.send_msg_legacy(other_ws, "leave_room", %{})

      WsClient.assert_frame_legacy("you_left_room", _, other_ws)

      assert %{
               peoplePreviewList: [
                 %{id: ^user_id}
               ]
             } = Rooms.get_room_by_id(room_id)
    end

    @tag :skip
    test "informs multiple clients that the room has been left"
  end
end
