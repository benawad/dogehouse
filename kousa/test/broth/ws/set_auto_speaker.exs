defmodule KousaTest.Broth.Ws.SetAutoSpeakerTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias Beef.Rooms
  alias Broth.WsClient
  alias Broth.WsClientFactory
  alias Kousa.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    ws_client = WsClientFactory.create_client_for(user)

    {:ok, user: user, ws_client: ws_client}
  end

  describe "the websocket set_auto_speaker operation" do
    @tag :skip
    test "makes the room be auto_speaker"
  end
end
