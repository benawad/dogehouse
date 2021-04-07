defmodule KousaTest.Broth.EditProfileTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias Broth.WsClient
  alias Broth.WsClientFactory
  alias Kousa.Support.Factory

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
        WsClient.send_call(
          t.client_ws,
          "edit_profile",
          %{
            "data" => %{
              "username" => "new_username"
            }
          }
        )

      WsClient.assert_reply(
        ref,
        %{"isUsernameTaken" => false}
      )

      assert Users.get_by_id(user_id).username == "new_username"
    end

    @tag :skip
    test "bad usernames"

    @tag :skip
    test "other fields"
  end
end
