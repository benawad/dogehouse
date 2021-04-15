defmodule KousaTest.Broth.Room.GetUsersTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias Broth.WsClient
  alias BrothTest.WsClientFactory
  alias KousaTest.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket room:get_users operation without ID works on the room you're in" do
    test "returns one user if you are in the room", t do
      user_id = t.user.id
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(user_id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:get_users",
          %{}
        )

      WsClient.assert_reply(
        "room:get_users:reply",
        ref,
        %{
          "users" => [%{"id" => ^user_id}]
        },
        t.client_ws
      )
    end

    test "returns two users if another is in the room", t do
      user_id = t.user.id
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(user_id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)

      # create a user that is logged in.
      other = %{id: other_id} = Factory.create(User)
      _other_ws = WsClientFactory.create_client_for(other)

      Kousa.Room.join_room(other_id, room_id)

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:get_users",
          %{}
        )

      WsClient.assert_reply(
        "room:get_users:reply",
        ref,
        %{
          "users" => users = [_, _]
        },
        t.client_ws
      )

      assert Enum.any?(users, &match?(%{"id" => ^user_id}, &1))
      assert Enum.any?(users, &match?(%{"id" => ^other_id}, &1))
    end

    @tag :skip
    test "returns what if the room doesn't exist"

    test "returns what if you're not in a room", t do
      user_id = t.user.id
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(user_id, "foo room", "foo", false)

      # create a user that is logged in.
      other = Factory.create(User)
      other_ws = WsClientFactory.create_client_for(other)

      ref =
        WsClient.send_call(
          other_ws,
          "room:get_users",
          %{}
        )

      WsClient.assert_error("room:get_users", ref, %{"id" => "you are not in a room"}, other_ws)
    end
  end
end
