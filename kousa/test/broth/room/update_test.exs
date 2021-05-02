defmodule BrothTest.Room.UpdateTest do
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

  describe "the websocket room:update operation" do
    test "makes the room public", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo", "isPrivate" => true}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)
      # make sure the room is private

      assert Rooms.get_room_by_id(room_id).isPrivate

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:update",
          %{"name" => "quux room", "isPrivate" => false}
        )

      WsClient.assert_reply(
        "room:update:reply",
        ref,
        %{"name" => "quux room", "isPrivate" => false}
      )

      # make sure the room is actually private
      assert %{
               isPrivate: false,
               name: "quux room"
             } = Rooms.get_room_by_id(room_id)
    end
  end
end
