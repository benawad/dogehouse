defmodule BrothTest.Room.GetTopTest do
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

  describe "the websocket room:get_top operation" do
    test "returns one public room if it's the only one", t do
      user_id = t.user.id

      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:get_top",
          %{}
        )

      WsClient.assert_reply(
        "room:get_top:reply",
        ref,
        %{"rooms" => [%{"id" => ^room_id}]},
        t.client_ws
      )
    end

    test "doesn't return a room if it's private", t do
      user_id = t.user.id

      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo", "isPrivate" => true}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:get_top",
          %{}
        )

      WsClient.assert_reply(
        "room:get_top:reply",
        ref,
        %{"rooms" => []},
        t.client_ws
      )
    end

    test "returns a room even if a random has blocked me", t do
      user_id = t.user.id

      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)

      random_who_blocked_me = Factory.create(User)

      WsClient.do_call(t.client_ws, "user:block", %{"userId" => random_who_blocked_me.id})

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:get_top",
          %{}
        )

      WsClient.assert_reply(
        "room:get_top:reply",
        ref,
        %{"rooms" => [%{"id" => ^room_id}]},
        t.client_ws
      )
    end

    test "doesn't return a room if creator user blocked me", t do
      user_id = t.user.id

      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo", "isPrivate" => false}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)

      blocked = Factory.create(User)
      blocked_ws = WsClientFactory.create_client_for(blocked)

      WsClient.do_call(t.client_ws, "user:block", %{"userId" => blocked.id})

      ref =
        WsClient.send_call(
          blocked_ws,
          "room:get_top",
          %{}
        )

      WsClient.assert_reply(
        "room:get_top:reply",
        ref,
        %{"rooms" => []},
        blocked_ws
      )
    end

    test "doesn't return a room if I user blocked the creator", t do
      room_creator_i_blocked = Factory.create(User)
      room_creator_i_blocked_ws = WsClientFactory.create_client_for(room_creator_i_blocked)

      WsClient.do_call(
        room_creator_i_blocked_ws,
        "room:create",
        %{"name" => "foo room", "description" => "foo", "isPrivate" => false}
      )

      WsClient.do_call(t.client_ws, "user:block", %{"userId" => room_creator_i_blocked.id})

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:get_top",
          %{}
        )

      WsClient.assert_reply(
        "room:get_top:reply",
        ref,
        %{"rooms" => []},
        t.client_ws
      )
    end

    @tag :skip
    test "when there's more than one room"

    @tag :skip
    test "cursors also work"

    @tag :skip
    test "there is a maximum limit to the cursor"
  end
end
