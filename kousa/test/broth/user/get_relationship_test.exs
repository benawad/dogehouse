defmodule BrothTest.User.GetRelationshipTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.User
  alias BrothTest.WsClient
  alias BrothTest.WsClientFactory
  alias KousaTest.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket user:get_relationship operation" do
    test "retrieves symmetric following info", t do
      user_id = t.user.id

      followed = %{id: followed_id} = Factory.create(User)
      followed_ws = WsClientFactory.create_client_for(followed)

      ref =
        WsClient.send_call(
          t.client_ws,
          "user:get_relationship",
          %{"userId" => user_id}
        )

      WsClient.assert_reply(
        "user:get_relationship:reply",
        ref,
        %{"relationship" => "self"},
        t.client_ws
      )

      ref =
        WsClient.send_call(
          t.client_ws,
          "user:get_relationship",
          %{"userId" => followed_id}
        )

      WsClient.assert_reply(
        "user:get_relationship:reply",
        ref,
        %{"relationship" => nil},
        t.client_ws
      )

      ref =
        WsClient.send_call(
          followed_ws,
          "user:get_relationship",
          %{"userId" => user_id}
        )

      WsClient.assert_reply(
        "user:get_relationship:reply",
        ref,
        %{"relationship" => nil},
        followed_ws
      )

      Kousa.Follow.follow(t.user.id, followed_id, true)
      Kousa.Follow.follow(followed_id, t.user.id, true)

      ref =
        WsClient.send_call(
          t.client_ws,
          "user:get_relationship",
          %{"userId" => followed_id}
        )

      WsClient.assert_reply(
        "user:get_relationship:reply",
        ref,
        %{"relationship" => "mutual"},
        t.client_ws
      )

      ref =
        WsClient.send_call(
          followed_ws,
          "user:get_relationship",
          %{"userId" => user_id}
        )

      WsClient.assert_reply(
        "user:get_relationship:reply",
        ref,
        %{"relationship" => "mutual"},
        followed_ws
      )
    end

    test "retrieves asymmetric following info", t do
      user_id = t.user.id

      followed = %{id: followed_id} = Factory.create(User)
      followed_ws = WsClientFactory.create_client_for(followed)

      Kousa.Follow.follow(t.user.id, followed_id, true)

      ref =
        WsClient.send_call(
          t.client_ws,
          "user:get_relationship",
          %{"userId" => followed_id}
        )

      WsClient.assert_reply(
        "user:get_relationship:reply",
        ref,
        %{"relationship" => "following"},
        t.client_ws
      )

      ref =
        WsClient.send_call(
          followed_ws,
          "user:get_relationship",
          %{"userId" => user_id}
        )

      WsClient.assert_reply(
        "user:get_relationship:reply",
        ref,
        %{"relationship" => "follower"},
        followed_ws
      )
    end
  end
end
