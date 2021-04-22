defmodule BrothTest.Room.CreateScheduledTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.User
  alias BrothTest.WsClient
  alias BrothTest.WsClientFactory
  alias KousaTest.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket room:create_scheduled operation" do
    test "edits a scheduled room", t do
      time = DateTime.utc_now() |> DateTime.add(10, :second)

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:create_scheduled",
          %{"name" => "foo room", "scheduledFor" => DateTime.to_iso8601(time)}
        )

      WsClient.assert_reply(
        "room:create_scheduled:reply",
        ref,
        %{"id" => room_id, "name" => "foo room"}
      )

      assert %{name: "foo room"} = Beef.ScheduledRooms.get_by_id(room_id)
    end
  end
end
