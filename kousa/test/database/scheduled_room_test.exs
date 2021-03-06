defmodule Kousa.Database.ScheduledRoomTest do
  # allow tests to run in parallel
  use ExUnit.Case, async: true

  alias Kousa.Support.Factory
  alias Beef.Repo
  alias Beef.Schemas.User
  alias Beef.Schemas.ScheduledRoom
  alias Beef.Room
  alias Kousa.Data

  import Kousa.Support.Helpers, only: [checkout_ecto_sandbox: 1]

  # do this for all async tests.  Eventually move this into a common
  # Kousa.Case module in `support` that you can use.
  setup :checkout_ecto_sandbox

  defp create_user(_) do
    {:ok, user: Factory.create(User)}
  end

  describe "you can create a scheduled room" do
    setup :create_user

    @scheduled_room_input %{
      name: "test scheduled room",
      description: "",
      numAttendees: 0,
      scheduledFor:
        DateTime.utc_now()
        |> Timex.shift(days: 1)
        |> Timex.format!("{ISO:Extended:Z}")
    }

    test "with ISO date", %{user: user} do
      {:ok, sr} = Data.ScheduledRoom.insert(Map.put(@scheduled_room_input, :creatorId, user.id))

      assert [^sr] = Repo.all(ScheduledRoom)
    end
  end
end
