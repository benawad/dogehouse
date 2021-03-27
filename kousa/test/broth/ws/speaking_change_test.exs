defmodule KousaTest.Broth.Ws.SpeakingChangeTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Broth.WsClient
  alias Broth.WsClientFactory
  alias Kousa.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    ws_client = WsClientFactory.create_client_for(user)

    {:ok, user: user, ws_client: ws_client}
  end

  describe "the websocket speaking_change operation" do
    @tag :skip
    test "makes the room have a different speaker"
  end
end
