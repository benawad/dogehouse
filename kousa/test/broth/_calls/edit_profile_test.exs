defmodule BrothTest.EditProfileTest do
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

  describe "the websocket edit_profile operation" do
    test "a username can be changed", t do
      user_id = t.user.id

      ref =
        WsClient.send_call_legacy(
          t.client_ws,
          "edit_profile",
          %{
            "data" => %{
              "username" => "new_username"
            }
          }
        )

      WsClient.assert_reply_legacy(
        ref,
        %{"username" => "new_username"}
      )

      assert Users.get_by_id(user_id).username == "new_username"
    end

    test "a username can't be changed to an existing username", t do
      user_id = t.user.id

      user2 = Factory.create(User)

      ref =
        WsClient.send_call_legacy(
          t.client_ws,
          "edit_profile",
          %{
            "data" => %{
              "username" => user2.username
            }
          }
        )

      WsClient.assert_reply_legacy(
        ref,
        %{"isUsernameTaken" => true}
      )
    end
  end
end
