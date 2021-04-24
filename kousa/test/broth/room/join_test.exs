defmodule BrothTest.Room.JoinTest do
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

  describe "the websocket room:join operation" do
    test "joins a user to a room", t do
      user_id = t.user.id

      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(user_id, "foo room", "foo", false)

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
end
