defmodule BrothTest.User.GetFollowingTest do
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

  describe "the websocket user:get_following operation" do
    test "returns an empty list if you aren't following anyone", t do
      ref = WsClient.send_call(t.client_ws, "user:get_following", %{"cursor" => 0})

      WsClient.assert_reply("user:get_following:reply", ref, %{"following" => []})
    end

    test "returns that person if you are following someone", t do
      %{id: followed_id} = Factory.create(User)
      Kousa.Follow.follow(t.user.id, followed_id, true)

      ref = WsClient.send_call(t.client_ws, "user:get_following", %{"cursor" => 0})

      WsClient.assert_reply("user:get_following:reply", ref, %{
        "following" => [
          %{
            "id" => ^followed_id
          }
        ]
      })
    end

    test "returns that person if you are following someone including the current room they are in",
         t do
      %{id: followed_id} = followed = Factory.create(User)
      followed_ws = WsClientFactory.create_client_for(followed)
      Kousa.Follow.follow(t.user.id, followed_id, true)

      room_ref =
        WsClient.send_call(
          followed_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      WsClient.assert_reply(
        "room:create:reply",
        room_ref,
        %{
          "id" => room_id
        }
      )

      ref = WsClient.send_call(t.client_ws, "user:get_following", %{"cursor" => 0})

      WsClient.assert_reply("user:get_following:reply", ref, %{
        "following" => [
          %{
            "id" => ^followed_id,
            "currentRoom" => %{"id" => ^room_id}
          }
        ]
      })
    end

    test "can get following for someone else", t do
      %{id: follower_id, username: username} = Factory.create(User)
      Kousa.Follow.follow(follower_id, t.user.id, true)

      ref =
        WsClient.send_call(t.client_ws, "user:get_following", %{
          "cursor" => 0,
          "username" => username
        })

      user_id = t.user.id

      WsClient.assert_reply("user:get_following:reply", ref, %{
        "following" => [
          %{
            "id" => ^user_id
          }
        ]
      })
    end

    @tag :skip
    test "test proper pagination of user:get_following"
  end
end
