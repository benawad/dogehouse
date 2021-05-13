defmodule BrothTest.User.UpdateTest do
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

  describe "the websocket user:update operation" do
    test "a username can be changed", t do
      user_id = t.user.id

      ref =
        WsClient.send_call(
          t.client_ws,
          "user:update",
          %{
            "username" => "new_username"
          }
        )

      WsClient.assert_reply(
        "user:update:reply",
        ref,
        %{
          "username" => "new_username"
        }
      )

      # and we will get a second reply, but that's for the case where
      # there are multiple ws out for the same user.
      WsClient.assert_frame(
        "user:update",
        %{
          "username" => "new_username"
        }
      )

      assert Users.get_by_id(user_id).username == "new_username"
    end

    test "username taken", t do
      existing_username = "oiqwjodjo"
      Factory.create(User, username: existing_username)

      ref =
        WsClient.send_call(
          t.client_ws,
          "user:update",
          %{
            "username" => existing_username
          }
        )

      WsClient.assert_error("user:update", ref, %{"username" => "has already been taken"})
    end

    test "a bio,displayName,avatarUrl can be changed", t do
      user_id = t.user.id

      ref =
        WsClient.send_call(
          t.client_ws,
          "user:update",
          %{
            "bio" => "hi",
            "displayName" => "test",
            "avatarUrl" =>
              "https://pbs.twimg.com/profile_images/1152793238761345024/VRBvxeCM_400x400.jpg"
          }
        )

      WsClient.assert_reply(
        "user:update:reply",
        ref,
        %{
          "bio" => "hi",
          "displayName" => "test",
          "avatarUrl" =>
            "https://pbs.twimg.com/profile_images/1152793238761345024/VRBvxeCM_400x400.jpg"
        }
      )

      user = Users.get_by_id(user_id)

      assert user.bio == "hi"
      assert user.displayName == "test"

      assert user.avatarUrl ==
               "https://pbs.twimg.com/profile_images/1152793238761345024/VRBvxeCM_400x400.jpg"
    end

    test "a bad avatar", t do
      user_id = t.user.id

      ref =
        WsClient.send_call(
          t.client_ws,
          "user:update",
          %{
            "avatarUrl" => "https://bob.example.com/"
          }
        )

      WsClient.assert_error("user:update", ref, %{"avatarUrl" => "has invalid format"})

      user = Users.get_by_id(user_id)

      assert user.avatarUrl == t.user.avatarUrl
    end

    @tag :skip
    test "when you have two websockets connected updating one propagates change to other"

    @tag :skip
    test "bad usernames"

    @tag :skip
    test "other fields"
  end

  describe "update banner url twitter variations" do
    test "no extension works", t do
      user_id = t.user.id
      url = "https://pbs.twimg.com/profile_banners/1241894903472427015/1587079476"

      ref =
        WsClient.send_call(
          t.client_ws,
          "user:update",
          %{
            "bannerUrl" => url
          }
        )

      WsClient.assert_reply(
        "user:update:reply",
        ref,
        %{
          "bannerUrl" => url
        }
      )

      user = Users.get_by_id(user_id)

      assert user.bannerUrl ==
               url
    end
  end
end
