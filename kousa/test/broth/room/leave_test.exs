defmodule BrothTest.Room.LeaveTest do
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

    %{"id" => room_id} =
      WsClient.do_call(
        client_ws,
        "room:create",
        %{"name" => "foo room", "description" => "foo"}
      )

    {:ok, user: user, client_ws: client_ws, room_id: room_id}
  end

  describe "the websocket room:leave operation" do
    test "deletes the room if they are the only person", t do
      room_id = t.room_id

      assert Users.get_by_id(t.user.id).currentRoomId == room_id

      ref = WsClient.send_call(t.client_ws, "room:leave", %{})

      WsClient.assert_reply("room:leave:reply", ref, _)

      refute Users.get_by_id(t.user.id).currentRoomId
      refute Rooms.get_room_by_id(room_id)
    end

    test "removes the person from the room if they aren't the only person", t do
      user_id = t.user.id
      room_id = t.room_id

      other = Factory.create(User)
      other_ws = WsClientFactory.create_client_for(other)

      assert %{peoplePreviewList: [_]} = Rooms.get_room_by_id(room_id)

      WsClient.do_call(other_ws, "room:join", %{"roomId" => room_id})

      assert %{peoplePreviewList: [_, _]} = Rooms.get_room_by_id(room_id)

      ref = WsClient.send_call(other_ws, "room:leave", %{})

      WsClient.assert_reply("room:leave:reply", ref, _)

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
