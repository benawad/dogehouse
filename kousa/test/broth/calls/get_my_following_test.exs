defmodule KousaTest.Broth.GetMyFollowingTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Broth.WsClient
  alias Broth.WsClientFactory
  alias Kousa.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket get_my_following operation" do
    test "returns an empty list if you aren't following anyone", t do
      ref = WsClient.send_call(t.client_ws, "get_my_following", %{"cursor" => 0})

      WsClient.assert_reply(ref, %{"users" => []})
    end

    test "returns that person if you are following someone", t do
      %{id: followed_id} = Factory.create(User)
      Kousa.Follow.follow(t.user.id, followed_id, true)

      ref = WsClient.send_call(t.client_ws, "get_my_following", %{"cursor" => 0})

      WsClient.assert_reply(ref, %{
        "users" => [
          %{
            "id" => ^followed_id
          }
        ]
      })
    end

    @tag :skip
    test "test proper pagination of get_my_following"
  end
end
