defmodule KousaTest.Broth.Ws.AuthTest do
  use ExUnit.Case, async: true

  describe "the websocket auth operation" do
    alias Beef.Schemas.RoomBlock
    alias Broth.WsClient

    test "is required within the timeout time or else the connection will be closed" do
      # set it to trap exits so we can watch the websocket connection die
      Process.flag(:trap_exit, true)

      # start and link the websocket client
      pid = start_supervised!(WsClient)
      Process.link(pid)

      assert_receive {:EXIT, ^pid, :normal}
    end

    test "can be sent an auth" do
      # set it to trap exits so we can watch the websocket connection die
      Process.flag(:trap_exit, true)

      # start and link the websocket client
      pid = start_supervised!(WsClient)
      Process.link(pid)

      WsClient.send_msg(pid, %{
        "op" => "auth",
        "d" => %{
          "accessToken" => "123",
          "refreshToken" => "abc",
          "platform" => "foo",
          "reconnectToVoice" => false,
          "muted" => false
        }
      })

      assert_receive {:EXIT, ^pid, :normal}
    end
  end
end
