defmodule KousaTest.Broth.Ws.AuthTest do
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

      assert_receive {:EXIT, ^pid, :normal}
    end

    test "can be sent an auth" do
      user = %{id: user_id} = Factory.create(User)
      tokens = Kousa.Utils.TokenUtils.create_tokens(user)

      # start and link the websocket client
      pid = start_supervised!(WsClient)
      Process.link(pid)
      WsClient.forward_frames(pid)

      WsClient.send_msg(pid, %{
        "op" => "auth",
        "d" => %{
          "accessToken" => tokens.accessToken,
          "refreshToken" => tokens.refreshToken,
          "platform" => "foo",
          "reconnectToVoice" => false,
          "muted" => false
        }
      })

      WsClient.assert_frame :text, %{
        "op" => "auth-good",
        "d" => %{"user" => %{"id" => ^user_id}}
      }
    end
  end
end
