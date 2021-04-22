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
          %{"id" => t.user.id}
        )

      WsClient.assert_reply(
        "user:get_info:reply",
        ref,
        %{
          "id" => ^user_id
        }
      )
    end

    @tag :skip
    test "you can't stalk someone who has blocked you"
  end
end
