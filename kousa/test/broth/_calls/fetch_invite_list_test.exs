defmodule BrothTest.FetchInviteListTest do
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

  describe "the websocket fetch_invite_list operation" do
    test "gets an empty list when you haven't invited anyone", t do
      WsClient.send_msg_legacy(t.client_ws, "fetch_invite_list", %{"cursor" => 0})
      WsClient.assert_frame("fetch_invite_list_done", %{"users" => []})
    end

    test "returns one user when you have invited them", t do
      # create a follower user that is logged in.
      follower = %{id: follower_id} = Factory.create(User)
      WsClientFactory.create_client_for(follower)
      Kousa.Follow.follow(follower_id, t.user.id, true)

      WsClient.send_msg_legacy(t.client_ws, "invite_to_room", %{"userId" => follower_id})

      WsClient.send_msg_legacy(t.client_ws, "fetch_invite_list", %{"cursor" => 0})

      WsClient.assert_frame(
        "fetch_invite_list_done",
        %{"users" => [%{"id" => ^follower_id}]},
        t.client_ws
      )
    end
  end
end
