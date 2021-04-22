defmodule BrothTest.Room.GetScheduledTest do
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

  describe "when you supply your userId to room:get_scheduled " do
    test "it returns no rooms if there are none", t do
      ref =
        WsClient.send_call(
          t.client_ws,
          "room:get_scheduled",
          %{"range" => "upcoming", "userId" => t.user.id}
        )

      WsClient.assert_reply(
        "room:get_scheduled:reply",
        ref,
        %{"rooms" => []}
      )
    end

    test "it returns most recent rooms", t do
      time = DateTime.utc_now() |> DateTime.add(10, :second)
      user_id = t.user.id

      Kousa.ScheduledRoom.schedule(user_id, %{
        "name" => "foo room",
        "scheduledFor" => time
      })

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:get_scheduled",
          %{"range" => "upcoming", "userId" => user_id}
        )

      WsClient.assert_reply(
        "room:get_scheduled:reply",
        ref,
        %{
          "rooms" => [
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

    test "it doesn't return other user's rooms", t do
      other_user = Factory.create(User)

      time = DateTime.utc_now() |> DateTime.add(10, :second)
      user_id = t.user.id

      Kousa.ScheduledRoom.schedule(other_user.id, %{
        "name" => "foo room",
        "scheduledFor" => time
      })

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:get_scheduled",
          %{"range" => "upcoming", "userId" => user_id}
        )

      WsClient.assert_reply(
        "room:get_scheduled:reply",
        ref,
        %{
          "rooms" => []
        }
      )
    end

    test "it won't return a far future room", t do
      time = DateTime.utc_now() |> DateTime.add(3600, :second)
      user_id = t.user.id

      Kousa.ScheduledRoom.schedule(user_id, %{
        "name" => "foo room",
        "scheduledFor" => time
      })

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:get_scheduled",
          %{"range" => "upcoming", "userId" => user_id}
        )

      WsClient.assert_reply(
        "room:get_scheduled:reply",
        ref,
        %{
          "rooms" => []
        }
      )
    end

    test "it will return a far future room if range is set to all", t do
      time = DateTime.utc_now() |> DateTime.add(3600, :second)
      user_id = t.user.id

      Kousa.ScheduledRoom.schedule(user_id, %{
        "name" => "foo room",
        "scheduledFor" => time
      })

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:get_scheduled",
          %{"userId" => user_id}
        )

      WsClient.assert_reply(
        "room:get_scheduled:reply",
        ref,
        %{
          "rooms" => [%{"scheduledFor" => the_future}]
        }
      )

      assert DateTime.to_iso8601(time) == the_future
    end

    @tag :skip
    test "you can supply someone else's userId"
  end

  describe "when you don't supply your userId to room:get_scheduled " do
    test "it returns no rooms if there are none", t do
      ref =
        WsClient.send_call(
          t.client_ws,
          "room:get_scheduled",
          %{}
        )

      WsClient.assert_reply(
        "room:get_scheduled:reply",
        ref,
        %{"rooms" => []}
      )
    end

    test "it returns other rooms", t do
      other_user = Factory.create(User)

      time = DateTime.utc_now() |> DateTime.add(10, :second)
      user_id = other_user.id

      Kousa.ScheduledRoom.schedule(user_id, %{
        "name" => "foo room",
        "scheduledFor" => time
      })

      ref =
        WsClient.send_call(
          t.client_ws,
          "room:get_scheduled",
          %{}
        )

      WsClient.assert_reply(
        "room:get_scheduled:reply",
        ref,
        %{
          "rooms" => [
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
