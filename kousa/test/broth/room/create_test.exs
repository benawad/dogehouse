defmodule BrothTest.Room.CreateTest do
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

  describe "the websocket room:create operation" do
    test "joins the user to the room", t do
      user_id = t.user.id

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:create",
          %{
            "name" => "foo room",
            "description" => "baz quux",
            "isPrivate" => true
          }
        )

      WsClient.assert_reply(
        "room:create:reply",
        ref,
        %{
          "creatorId" => ^user_id,
          "description" => "baz quux",
          "id" => room_id,
          "name" => "foo room",
          "isPrivate" => true
        }
      )

      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)
    end

    test "can pass null description", t do
      user_id = t.user.id

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:create",
          %{
            "name" => "foo room",
            "description" => nil,
            "isPrivate" => true
          }
        )

      WsClient.assert_reply(
        "room:create:reply",
        ref,
        %{
          "creatorId" => ^user_id,
          "description" => "",
          "id" => room_id,
          "name" => "foo room",
          "isPrivate" => true
        }
      )

      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)
    end
  end
end
