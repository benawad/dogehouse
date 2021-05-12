defmodule BrothTest.User.AdminUpdateTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias BrothTest.WsClient
  alias BrothTest.WsClientFactory
  alias KousaTest.Support.Factory

  require WsClient

  @ben_github_id Application.compile_env!(:kousa, :ben_github_id)

  setup do
    user = Factory.create(User, githubId: @ben_github_id)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket user:admin_update operation" do
    test "doesn't work for not-ben awad" do
      staffed = Factory.create(User)
      staff_ws = WsClientFactory.create_client_for(staffed)

      ref =
        WsClient.send_call(staff_ws, "user:admin_update", %{
          "username" => staffed.username,
          "user" => %{
            "staff" => true,
            "contributions" => 100
          }
        })

      WsClient.assert_error("user:admin_update", ref, %{"message" => "not authorized"})
    end

    test "works for ben awad", t do
      staffed = Factory.create(User)

      ref =
        WsClient.send_call(t.client_ws, "user:admin_update", %{
          "username" => staffed.username,
          "user" => %{
            "staff" => true,
            "contributions" => 100
          }
        })

      WsClient.assert_reply("user:admin_update:reply", ref, %{
        "staff" => true,
        "contributions" => 100
      })

      # check that the user has been updated.
      assert %{staff: true, contributions: 100} = Users.get_by_id(staffed.id)
    end

    test "can update single field", t do
      staffed = Factory.create(User)

      WsClient.do_call(t.client_ws, "user:admin_update", %{
        "username" => staffed.username,
        "user" => %{
          "staff" => true,
          "contributions" => 100
        }
      })

      ref =
        WsClient.send_call(t.client_ws, "user:admin_update", %{
          "username" => staffed.username,
          "user" => %{
            "staff" => false
          }
        })

      WsClient.assert_reply("user:admin_update:reply", ref, %{
        "staff" => false,
        "contributions" => 100
      })

      # check that the user has been updated.
      assert %{staff: false, contributions: 100} = Users.get_by_id(staffed.id)
    end
  end
end
