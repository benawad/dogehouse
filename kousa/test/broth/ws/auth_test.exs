defmodule KousaTest.Broth.Ws.AuthTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Broth.WsClient
  alias Kousa.Support.Factory

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
      user = Factory.create(User)
      tokens = Kousa.Utils.TokenUtils.create_tokens(user)

      # start and link the websocket client
      pid = start_supervised!(WsClient)
      Process.link(pid)

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

      refute_receive {:EXIT, ^pid, :normal}, 200
    end
  end
end
