defmodule BrothTest.User.SetContributionsTest do
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

  describe "the websocket user:set_staff operation" do
    test "doesn't work for not-ben awad", t do
      contributor = Factory.create(User)
      WsClientFactory.create_client_for(contributor)

      ref =
        WsClient.send_call(t.client_ws, "user:set_contributions", %{
          "username" => contributor.username,
          "value" => 100
        })

      WsClient.assert_error("user:set_contributions", ref, %{"message" => message})
      assert message =~ "but that user didn't exist"
    end

    @ben_github_id Application.compile_env!(:kousa, :ben_github_id)

    test "works for ben awad", t do
      t.user
      |> User.changeset(%{githubId: @ben_github_id})
      |> Beef.Repo.update!()

      contributor = Factory.create(User)

      ref =
        WsClient.send_call(t.client_ws, "user:set_contributions", %{
          "username" => contributor.username,
          "value" => 100
        })

      WsClient.assert_reply("user:set_contributions:reply", ref, reply)
      refute is_map_key(reply, "error")

      # check that the user has been updated.
      assert %{contributions: 100} = Users.get_by_id(contributor.id)
    end
  end
end
