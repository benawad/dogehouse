# @todo should probably stop this after initial load
defmodule Kousa.Gen.StartRooms do
  use GenServer
  alias Kousa.Gen
  alias Beef.Rooms

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_opts) do
    Enum.each(Rooms.all_rooms(), fn room ->
      GenRegistry.lookup_or_start(Gen.RoomSession, room.id, [
        %{
          room_id: room.id,
          voice_server_id: room.voiceServerId
        }
      ])
    end)

    {:ok, %{}}
  end
end
