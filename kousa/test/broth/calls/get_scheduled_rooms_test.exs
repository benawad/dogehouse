defmodule KousaTest.Broth.GetScheduledRoomsTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Broth.WsClient
  alias Broth.WsClientFactory
  alias Kousa.Support.Factory
  alias Beef.Schemas.ScheduledRoom

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket get_scheduled_rooms operation" do
    @tag :skip
    test "returns a scheduled room"

    test "pagination works correctly", t do
      rooms = Enum.map(1..15, fn _ -> Factory.create(ScheduledRoom) end)
      second_page_item = Factory.create(ScheduledRoom)
      last_item = Enum.at(rooms, 14)
      ref = WsClient.send_call(t.client_ws, "get_scheduled_rooms", %{"cursor" => ""})

      expected_next_cursor =
        (DateTime.to_iso8601(last_item.scheduledFor)
         |> String.replace("-", "")
         |> String.replace(":", "")) <>
          "|" <> last_item.id

      WsClient.assert_reply(ref, %{
        "nextCursor" => ^expected_next_cursor
      })

      ref2 =
        WsClient.send_call(t.client_ws, "get_scheduled_rooms", %{"cursor" => expected_next_cursor})

      second_page_item_id = second_page_item.id

      WsClient.assert_reply(ref2, %{
        "nextCursor" => nil,
        "scheduledRooms" => [
          %{
            "id" => ^second_page_item_id
          }
        ]
      })
    end
  end
end
