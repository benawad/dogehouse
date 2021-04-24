defmodule BrothTest.GetScheduledRoomsTest do
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

  describe "the websocket get_scheduled_rooms operation" do
    test "returns no scheduled rooms", t do
      ref =
        WsClient.send_call_legacy(
          t.client_ws,
          "get_scheduled_rooms",
          %{}
        )

      WsClient.assert_reply_legacy(
        ref,
        %{
          "scheduledRooms" => []
        }
      )
    end

    test "returns a scheduled room", t do
      time = DateTime.utc_now() |> DateTime.add(10, :second)
      user_id = t.user.id

      Kousa.ScheduledRoom.schedule(user_id, %{
        "name" => "foo room",
        "scheduledFor" => time
      })

      ref =
        WsClient.send_call_legacy(
          t.client_ws,
          "get_scheduled_rooms",
          %{}
        )

      WsClient.assert_reply_legacy(
        ref,
        %{
          "scheduledRooms" => [
            %{
              "creator" => %{"id" => ^user_id},
              "name" => "foo room",
              "scheduledFor" => the_future
            }
          ]
        }
      )

      assert DateTime.to_iso8601(time) == the_future
    end

    test "does return someone else's scheduled room", t do
      other_user = Factory.create(User)

      time = DateTime.utc_now() |> DateTime.add(10, :second)

      {:ok, %{id: room_id}} =
        Kousa.ScheduledRoom.schedule(other_user.id, %{
          "name" => "foo room",
          "scheduledFor" => time
        })

      ref =
        WsClient.send_call_legacy(
          t.client_ws,
          "get_scheduled_rooms",
          %{}
        )

      WsClient.assert_reply_legacy(
        ref,
        %{
          "scheduledRooms" => [%{"id" => ^room_id}]
        }
      )
    end

    test "does not return someone else's scheduled room if getOnlyMyScheduledRooms is set", t do
      other_user = Factory.create(User)

      time = DateTime.utc_now() |> DateTime.add(10, :second)

      Kousa.ScheduledRoom.schedule(other_user.id, %{
        "name" => "foo room",
        "scheduledFor" => time
      })

      ref =
        WsClient.send_call_legacy(
          t.client_ws,
          "get_scheduled_rooms",
          %{"getOnlyMyScheduledRooms" => true}
        )

      WsClient.assert_reply_legacy(
        ref,
        %{
          "scheduledRooms" => []
        }
      )
    end
  end
end
