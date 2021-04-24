defmodule BrothTest.Room.GetInviteListTest do
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

  describe "the websocket room:get_invite_list operation" do
    test "gets an empty list when you haven't invited anyone", t do
      ref = WsClient.send_call(t.client_ws, "room:get_invite_list", %{"cursor" => 0})
      WsClient.assert_reply("room:get_invite_list:reply", ref, %{"invites" => []}, t.client_ws)
    end

    test "returns one user when you have invited them", t do
      # create a follower user that is logged in.
      follower = %{id: follower_id} = Factory.create(User)
      WsClientFactory.create_client_for(follower)
      Kousa.Follow.follow(follower_id, t.user.id, true)

      WsClient.send_msg(t.client_ws, "room:invite", %{"userId" => follower_id})

      ref = WsClient.send_call(t.client_ws, "room:get_invite_list", %{"cursor" => 0})

      WsClient.assert_reply(
        "room:get_invite_list:reply",
        ref,
        %{"invites" => [%{"id" => ^follower_id}]},
        t.client_ws
      )
    end
  end
end
