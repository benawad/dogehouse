defmodule BrothTest.Room.UpdateScheduledTest do
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

  describe "the websocket room:update_scheduled operation" do
    test "edits a scheduled room", t do
      time = DateTime.utc_now() |> DateTime.add(10, :second)
      user_id = t.user.id

      {:ok, %{id: room_id}} =
        Kousa.ScheduledRoom.schedule(user_id, %{
          "name" => "foo room",
          "scheduledFor" => time
        })

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:update_scheduled",
          %{"id" => room_id, "name" => "bar room"}
        )

      WsClient.assert_reply(
        "room:update_scheduled:reply",
        ref,
        %{"name" => "bar room"}
      )

      assert %{name: "bar room"} = Beef.ScheduledRooms.get_by_id(room_id)
    end
  end
end
