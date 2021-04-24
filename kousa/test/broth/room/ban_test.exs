defmodule BrothTest.Room.BanTest do
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

  describe "the websocket room:ban operation" do
    test "blocks that person from a room", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"})
          
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a blocked user that is logged in.
      blocked = %{id: blocked_id} = Factory.create(User)
      blocked_ws = WsClientFactory.create_client_for(blocked)

      # join the blocked user into the room
      WsClient.do_call(blocked_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame("new_user_join_room", _)

      # block the person.
      WsClient.send_msg(t.client_ws, "room:ban", %{"userId" => blocked_id})

      WsClient.assert_frame(
        "user_left_room",
        %{"roomId" => ^room_id, "userId" => ^blocked_id},
        t.client_ws
      )

      assert Beef.RoomBlocks.blocked?(room_id, blocked_id)
    end
  end
end
