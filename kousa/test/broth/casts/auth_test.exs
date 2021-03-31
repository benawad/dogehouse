defmodule KousaTest.Broth.AuthTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Broth.WsClient
  alias Kousa.Support.Factory

  require WsClient

  describe "the websocket auth operation" do
    test "is required within the timeout time or else the connection will be closed" do
      # set it to trap exits so we can watch the websocket connection die
      Process.flag(:trap_exit, true)

      # start and link the websocket client
      pid = start_supervised!(WsClient)
      Process.link(pid)

      WsClient.assert_dies(pid, fn -> nil end, :normal)
    end

    test "can be sent an auth" do
      user = %{id: user_id} = Factory.create(User)
      tokens = Kousa.Utils.TokenUtils.create_tokens(user)

      # start and link the websocket client
      pid = start_supervised!(WsClient)
      Process.link(pid)
      WsClient.forward_frames(pid)

      WsClient.send_msg(pid, "auth", %{
        "accessToken" => tokens.accessToken,
        "refreshToken" => tokens.refreshToken,
        "platform" => "foo",
        "reconnectToVoice" => false,
        "muted" => false
      })

      WsClient.assert_frame("auth-good", %{"user" => %{"id" => ^user_id}})
    end

    test "fails auth if the accessToken is borked" do
      user = Factory.create(User)
      Kousa.Utils.TokenUtils.create_tokens(user)

      # start and link the websocket client
      pid = start_supervised!(WsClient)

      # the websocket should die.
      WsClient.assert_dies(
        pid,
        fn ->
          WsClient.send_msg(pid, "auth", %{
            "accessToken" => "foo",
            "refreshToken" => "bar",
            "platform" => "foo",
            "reconnectToVoice" => false,
            "muted" => false
          })
        end,
        {:remote, 4001, "invalid_authentication"}
      )
    end
  end
end
