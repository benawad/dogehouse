defmodule BrothTest.Room.DeleteScheduledTest do
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

  describe "when you supply roomId to room:delete_scheduled " do
    test "it deletes the room", t do
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
          "room:delete_scheduled",
          %{"roomId" => room_id}
        )

      WsClient.assert_reply(
        "room:delete_scheduled:reply",
        ref,
        %{}
      )

      refute Beef.ScheduledRooms.get_by_id(room_id)
    end
  end
end
