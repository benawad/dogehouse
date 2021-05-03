defmodule BrothTest.Room.JoinTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.UserBlocks
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

  describe "the websocket room:join operation" do
    test "joins a user to a room", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      other = Factory.create(User)
      other_ws = WsClientFactory.create_client_for(other)

      ref =
        WsClient.send_call(
          other_ws,
          "room:join",
          %{"roomId" => room_id}
        )

      WsClient.assert_reply(
        "room:join:reply",
        ref,
        %{
          "description" => "foo",
          "id" => room_id,
          "name" => "foo room",
          "isPrivate" => false
        }
      )

      assert %{currentRoomId: ^room_id} = Users.get_by_id(other.id)
    end
  end

  describe "the user cannot join a room" do
    test "if the creator blocked them", t do
      %{"id" => room_id, "creatorId" => creatorId} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      # create a user that is logged in.
      blocked = Factory.create(User)
      blocked_ws = WsClientFactory.create_client_for(blocked)

      # block the new user
      WsClient.do_call(t.client_ws, "user:block", %{"userId" => blocked.id})

      assert UserBlocks.blocked?(creatorId, blocked.id)

      ref =
        WsClient.send_call(
          blocked_ws,
          "room:join",
          %{"roomId" => room_id}
        )

      WsClient.assert_error(
        "room:join",
        ref,
        %{
          "message" => "the creator of the room blocked you"
        }
      )

      assert %{currentRoomId: nil} = Users.get_by_id(blocked.id)
    end
  end
end
