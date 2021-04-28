defmodule BrothTest.User.CreateBotTest do
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

  describe "the websocket user:create_bot operation" do
    test "creates new user with username", t do
      ref =
        WsClient.send_call(
          t.client_ws,
          "user:create_bot",
          %{
            "username" => "qowidjoqwd"
          }
        )

      WsClient.assert_reply(
        "user:create_bot:reply",
        ref,
        %{"apiKey" => apiKey}
      )

      assert {:ok, _} = Ecto.UUID.cast(apiKey)
      %{botOwnerId: botOwnerId} = Users.get_by_api_key(apiKey)
      user_id = t.user.id
      assert user_id == botOwnerId
    end

    test "returns error for username that's already taken", t do
      ref =
        WsClient.send_call(
          t.client_ws,
          "user:create_bot",
          %{
            "username" => t.user.username
          }
        )

      WsClient.assert_reply(
        "user:create_bot:reply",
        ref,
        %{"isUsernameTaken" => true}
      )
    end

    test "bot accounts can't create bot accounts", t do
      ref =
        WsClient.send_call(
          t.client_ws,
          "user:create_bot",
          %{
            "username" => "oqieuoqw"
          }
        )

      WsClient.assert_reply(
        "user:create_bot:reply",
        ref,
        %{"apiKey" => apiKey}
      )

      assert {:ok, _} = Ecto.UUID.cast(apiKey)
      user = Users.get_by_api_key(apiKey)
      bot_ws = WsClientFactory.create_client_for(user)

      bot_ref =
        WsClient.send_call(
          bot_ws,
          "user:create_bot",
          %{
            "username" => "qowidjoqwdqwe"
          }
        )

      WsClient.assert_reply(
        "user:create_bot:reply",
        bot_ref,
        %{"error" => "bots can't create bots"}
      )
    end
  end
end
