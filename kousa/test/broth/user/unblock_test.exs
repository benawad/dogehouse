defmodule BrothTest.User.UnblockTest do
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

  describe "the websocket user:unblock operation" do
    test "unblocks that person from the user", t do
      # create a blocked user that is logged in.
      %{id: blocked_id} = Factory.create(User)

      ref =
        WsClient.send_call(
          t.client_ws,
          "user:block",
          %{"userId" => blocked_id}
        )

      # assert that you get a response that is yourself with an updated
      # block list.
      WsClient.assert_reply(
        "user:block:reply",
        ref,
        %{"blocked" => [^blocked_id]},
        t.client_ws
      )

      ref2 =
        WsClient.send_call(
          t.client_ws,
          "user:unblock",
          %{"userId" => blocked_id}
        )

      # assert that you get a response that is yourself with an updated
      # block list.
      WsClient.assert_reply(
        "user:unblock:reply",
        ref2,
        %{},
        t.client_ws
      )

      refute Beef.UserBlocks.blocked?(t.user.id, blocked_id)
    end
  end
end
