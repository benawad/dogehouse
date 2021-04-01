defmodule KousaTest.Broth.CreateRoomFromScheduledRoomTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Broth.WsClient
  alias Broth.WsClientFactory
  alias Kousa.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket create_room_from_scheduled_room operation" do
    @tag :skip
    test "converts a scheduled room to a real room"
  end
end
