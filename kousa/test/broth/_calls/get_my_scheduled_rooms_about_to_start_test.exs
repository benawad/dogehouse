defmodule KousaTest.Broth.GetMyScheduledRoomsAboutToStartTest do
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

  describe "the websocket get_my_scheduled_rooms_about_to_start operation" do
    test "returns a scheduled room", t do
      time = DateTime.utc_now() |> DateTime.add(10, :second)
      user_id = t.user.id

      {:ok, sroom} =
        Kousa.ScheduledRoom.schedule(user_id, %{
          "name" => "foo room",
          "scheduledFor" => time
        })

      ref =
        WsClient.send_call_legacy(
          t.client_ws,
          "get_my_scheduled_rooms_about_to_start",
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
  end
end
