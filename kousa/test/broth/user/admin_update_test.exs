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
    staff_user = Factory.create(User)

    client_ws = WsClientFactory.create_client_for(user)
    staff_client_ws = WsClientFactory.create_client_for(staff_user)

    {:ok,
     user: user, staff_user: staff_user, staff_client_ws: staff_client_ws, client_ws: client_ws}
  end

  describe "the websocket user:admin_update operation" do
    test "doesn't work for not-ben awad", t do
      ref =
        WsClient.send_call(t.staff_client_ws, "user:admin_update", %{
          "username" => t.staff_user.username,
          "user" => %{
            "staff" => true,
            "contributions" => 100
          }
        })

      WsClient.assert_error("user:admin_update", ref, %{"message" => "not authorized"})
    end

    test "works for ben awad", t do
      ref =
        WsClient.send_call(t.client_ws, "user:admin_update", %{
          "username" => t.staff_user.username,
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
      assert %{staff: true, contributions: 100} = Users.get_by_id(t.staff_user.id)
    end

    test "works for staff", t do
      ref =
        WsClient.send_call(t.client_ws, "user:admin_update", %{
          "username" => t.staff_user.username,
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
      assert %{staff: true, contributions: 100} = Users.get_by_id(t.staff_user.id)

      staffed = Factory.create(User)

      ref =
        WsClient.send_call(t.staff_client_ws, "user:admin_update", %{
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
      WsClient.do_call(t.client_ws, "user:admin_update", %{
        "username" => t.staff_user.username,
        "user" => %{
          "staff" => true,
          "contributions" => 100
        }
      })

      ref =
        WsClient.send_call(t.client_ws, "user:admin_update", %{
          "username" => t.staff_user.username,
          "user" => %{
            "staff" => false
          }
        })

      WsClient.assert_reply("user:admin_update:reply", ref, %{
        "staff" => false,
        "contributions" => 100
      })

      # check that the user has been updated.
      assert %{staff: false, contributions: 100} = Users.get_by_id(t.staff_user.id)
    end
  end
end
