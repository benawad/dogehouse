defmodule BrothTest.DeleteScheduledRoomTest do
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

  describe "the websocket delete_scheduled_room operation" do
    test "deletes a scheduled room", t do
      time = DateTime.utc_now() |> DateTime.add(10, :second)
      user_id = t.user.id

      {:ok, %{id: room_id}} =
        Kousa.ScheduledRoom.schedule(user_id, %{
          "name" => "foo room",
          "scheduledFor" => time
        })

      ref =
        WsClient.send_call_legacy(
          t.client_ws,
          "delete_scheduled_room",
          %{"id" => room_id}
        )

      WsClient.assert_reply_legacy(
        ref,
        %{}
      )

      refute Beef.ScheduledRooms.get_by_id(room_id)
    end
  end
end
