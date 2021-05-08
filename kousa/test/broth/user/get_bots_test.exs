defmodule BrothTest.User.GetBotsTest do
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

  describe "the user:get_bots operation" do
    test "gets bots", t do
      WsClient.do_call(t.client_ws, "user:create_bot", %{
        "username" => "marvin"
      })

      ref = WsClient.send_call(t.client_ws, "user:get_bots", %{})

      WsClient.assert_reply("user:get_bots:reply", ref, %{"bots" => [%{"username" => "marvin"}]})
    end
  end
end
