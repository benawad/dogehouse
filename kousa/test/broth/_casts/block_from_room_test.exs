defmodule BrothTest.BlockFromRoomTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  import KousaTest.Support.Deprecations

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

  describe "the websocket block_from_room operation" do
    test "blocks that person from a room", t do
      room_id = t.room_id
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a blocked user that is logged in.
      blocked = %{id: blocked_id} = Factory.create(User)
      blocked_ws = WsClientFactory.create_client_for(blocked)

      # join the blocked user into the room
      WsClient.do_call(blocked_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      # block the person.
      WsClient.send_msg_legacy(t.client_ws, "block_from_room", %{"userId" => blocked_id})

      WsClient.assert_frame_legacy(
        "user_left_room",
        %{"roomId" => ^room_id, "userId" => ^blocked_id},
        t.client_ws
      )

      assert Beef.RoomBlocks.blocked?(room_id, blocked_id)
    end
  end

  describe "the websocket block_user_and_from_room operation" do
    test "blocks that person from a room", t do
      room_id = t.room_id
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a blocked user that is logged in.
      blocked = %{id: blocked_id} = Factory.create(User)
      blocked_ws = WsClientFactory.create_client_for(blocked)

      # join the blocked user into the room
      WsClient.do_call(blocked_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      capture_deprecation(fn ->
        # block the person.
        WsClient.send_msg_legacy(t.client_ws, "block_user_and_from_room", %{
          "userId" => blocked_id
        })

        WsClient.assert_frame_legacy(
          "user_left_room",
          %{"roomId" => ^room_id, "userId" => ^blocked_id},
          t.client_ws
        )
      end)

      assert Beef.RoomBlocks.blocked?(room_id, blocked_id)
      assert Beef.UserBlocks.blocked?(t.user.id, blocked_id)
    end
  end
end
