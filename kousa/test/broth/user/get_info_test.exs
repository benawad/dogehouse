defmodule BrothTest.User.GetInfoTest do
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

  describe "the websocket user:get_info operation" do
    test "can get your own user info", t do
      user_id = t.user.id

      ref =
        WsClient.send_call(
          t.client_ws,
          "user:get_info",
          %{"userIdOrUsername" => t.user.id}
        )

      WsClient.assert_reply(
        "user:get_info:reply",
        ref,
        %{
          "id" => ^user_id
        }
      )
    end

    test "you get nil back for username that doesn't exist", t do
      ref =
        WsClient.send_call(
          t.client_ws,
          "user:get_info",
          %{"userIdOrUsername" => "aosifdjoqwejfoq"}
        )

      WsClient.assert_reply(
        "user:get_info:reply",
        ref,
        %{"error" => "could not find user"}
      )
    end

    @tag :skip
    test "you can't stalk someone who has blocked you"
  end

  describe "doesn't return a user back" do
    test "if the user blocked you", t do
      blocked = Factory.create(User)
      blocked_ws = WsClientFactory.create_client_for(blocked)

      WsClient.do_call(t.client_ws, "user:block", %{"userId" => blocked.id})

      ref =
        WsClient.send_call(
          blocked_ws,
          "user:get_info",
          %{"userIdOrUsername" => t.user.id}
        )

      WsClient.assert_reply(
        "user:get_info:reply",
        ref,
        %{"error" => "blocked"}
      )

      # username search results in the same
      ref2 =
        WsClient.send_call(
          blocked_ws,
          "user:get_info",
          %{"userIdOrUsername" => t.user.username}
        )

      WsClient.assert_reply(
        "user:get_info:reply",
        ref2,
        %{"error" => "blocked"}
      )
    end
  end
end
