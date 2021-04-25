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

  describe "the websocket bot:create operation" do
    test "creates new user with username", t do
      ref =
        WsClient.send_call(
          t.client_ws,
          "bot:create",
          %{
            "username" => "qowidjoqwd"
          }
        )

      WsClient.assert_reply(
        "bot:create:reply",
        ref,
        %{"apiKey" => _}
      )
    end

    test "returns error for username that's already taken", t do
      ref =
        WsClient.send_call(
          t.client_ws,
          "bot:create",
          %{
            "username" => t.user.username
          }
        )

      WsClient.assert_reply(
        "bot:create:reply",
        ref,
        %{"isUsernameTaken" => true}
      )
    end
  end
end
