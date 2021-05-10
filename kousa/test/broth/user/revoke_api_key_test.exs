defmodule BrothTest.User.RevokeApiKeyTest do
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

  describe "the user:revoke_api_key operation" do
    test "causes the api key to update", t do
      WsClient.do_call(t.client_ws, "user:create_bot", %{
        "username" => "marvin"
      })

      %User{id: user_id, apiKey: api_key} = Beef.Users.get_by_username("marvin")

      ref =
        WsClient.send_call(t.client_ws, "user:revoke_api_key", %{
          "userId" => user_id
        })

      WsClient.assert_reply("user:revoke_api_key:reply", ref, %{"apiKey" => _})

      refute api_key == Beef.Users.get_by_username("marvin").apiKey
    end

    test "you need to own the bot to revoke the api key", t do
      WsClient.do_call(t.client_ws, "user:create_bot", %{
        "username" => "marvin"
      })

      %User{id: user_id, apiKey: api_key} = Beef.Users.get_by_username("marvin")

      other_user = Factory.create(User)
      other_client_ws = WsClientFactory.create_client_for(other_user)

      ref =
        WsClient.send_call(other_client_ws, "user:revoke_api_key", %{
          "userId" => user_id
        })

      WsClient.assert_error("user:revoke_api_key", ref, %{"message" => "not authorized"})

      assert api_key == Beef.Users.get_by_username("marvin").apiKey
    end
  end
end
