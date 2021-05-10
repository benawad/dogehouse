defmodule BrothTest.Message.User.AdminUpdateTest do
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

  describe "the websocket user:admin_update operation" do
    test "doesn't work for not-ben awad", t do
      staffed = Factory.create(User)
      WsClientFactory.create_client_for(staffed)

      ref =
        WsClient.send_call(t.client_ws, "user:admin_update", %{
          "username" => staffed.username,
          "staff" => true,
          "contributions" => 100
        })

      WsClient.assert_error("user:admin_update", ref, %{"message" => message})
      assert message =~ "not authorized"
    end

    @ben_github_id Application.compile_env!(:kousa, :ben_github_id)

    test "works for ben awad", t do
      t.user
      |> User.changeset(%{githubId: @ben_github_id})
      |> Beef.Repo.update!()

      staffed = Factory.create(User)

      ref =
        WsClient.send_call(t.client_ws, "user:admin_update", %{
          "username" => staffed.username,
          "staff" => true,
          "contributions" => 100
        })

      WsClient.assert_reply("user:admin_update:reply", ref, reply)
      refute is_map_key(reply, "error")

      # check that the user has been updated.
      assert %{staff: true, contributions: 100} = Users.get_by_id(staffed.id)
    end
  end
end
