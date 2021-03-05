# @todo should probably stop this after initial load
defmodule Kousa.Gen.StartRabbits do
  use GenServer
  alias Kousa.Gen
  alias Kousa.VoiceServerUtils

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_opts) do
    n = Application.get_env(:kousa, :num_voice_servers, 1) - 1

    Enum.each(0..n, fn x ->
      str_id = VoiceServerUtils.idx_to_str_id(x)

      GenRegistry.lookup_or_start(Gen.VoiceRabbit, str_id, [
        %Gen.VoiceRabbit.State{id: str_id, chan: nil}
      ])

      GenRegistry.lookup_or_start(Gen.VoiceOnlineRabbit, str_id, [
        %Gen.VoiceOnlineRabbit.State{id: str_id, chan: nil}
      ])
    end)

    {:ok, %{}}
  end
end
