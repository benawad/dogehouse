defmodule BrothTest.FollowTest do
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

  describe "the follow operation" do
    test "causes you to follow", t do
      followed = Factory.create(User)

      refute Beef.Follows.following_me?(followed.id, t.user.id)

      WsClient.send_call_legacy(t.client_ws, "follow", %{
        "userId" => followed.id,
        "value" => true
      })

      WsClient.assert_frame_legacy(_, _payload)

      assert Beef.Follows.following_me?(followed.id, t.user.id)
    end

    test "causes you to to unfollow", t do
      followed = Factory.create(User)

      Beef.Follows.insert(%{
        userId: followed.id,
        followerId: t.user.id
      })

      assert Beef.Follows.following_me?(followed.id, t.user.id)

      WsClient.send_call_legacy(t.client_ws, "follow", %{
        "userId" => followed.id,
        "value" => false
      })

      WsClient.assert_frame_legacy(_, _payload)

      refute Beef.Follows.following_me?(followed.id, t.user.id)
    end

    @tag :skip
    test "you can't follow yourself?"
  end
end
