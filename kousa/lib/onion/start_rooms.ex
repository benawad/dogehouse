# @todo should probably stop this after initial load
defmodule Onion.StartRooms do
  use GenServer
  alias Beef.Rooms

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_opts) do
    Enum.each(Rooms.all_rooms(), fn room ->
      GenRegistry.lookup_or_start(Onion.RoomSession, room.id, [
        %{
          room_id: room.id,
          voice_server_id: room.voiceServerId
        }
      ])
    end)

    {:ok, %{}}
  end
end
