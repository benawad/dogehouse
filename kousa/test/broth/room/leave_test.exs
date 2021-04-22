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

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket room:leave operation" do
    test "deletes the room if they are the only person", t do
      {:ok, %{room: room}} =
        Kousa.Room.create_room(
          t.user.id,
          "my private room",
          "stay out",
          true
        )

      assert Users.get_by_id(t.user.id).currentRoomId == room.id

      ref = WsClient.send_call(t.client_ws, "room:leave", %{})

      WsClient.assert_reply("room:leave:reply", ref, _)

      refute Users.get_by_id(t.user.id).currentRoomId
      refute Rooms.get_room_by_id(room.id)
    end

    test "removes the person from the room if they aren't the only person", t do
      user_id = t.user.id

      {:ok, %{room: room}} =
        Kousa.Room.create_room(
          user_id,
          "my public room",
          "come in",
          false
        )

      other = %{id: other_id} = Factory.create(User)
      other_ws = WsClientFactory.create_client_for(other)

      assert %{peoplePreviewList: [_]} = Rooms.get_room_by_id(room.id)

      Kousa.Room.join_room(other_id, room.id)

      assert %{peoplePreviewList: [_, _]} = Rooms.get_room_by_id(room.id)

      ref = WsClient.send_call(other_ws, "room:leave", %{})

      WsClient.assert_reply("room:leave:reply", ref, _)

      assert %{
               peoplePreviewList: [
                 %{id: ^user_id}
               ]
             } = Rooms.get_room_by_id(room.id)
    end

    @tag :skip
    test "informs multiple clients that the room has been left"
  end
end
