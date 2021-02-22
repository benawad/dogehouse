defmodule Kousa.Gen.Telemetry do
  use GenServer

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_opts) do
    Process.send_after(self(), {:collect_metrics}, 10_000)

    {:ok, %{}}
  end

  def handle_info({:collect_metrics}, state) do
    Kousa.Metric.UserSessions.set(GenRegistry.count(Kousa.Gen.UserSession))
    Process.send_after(self(), {:collect_metrics}, 10_000)
    {:noreply, state}
  end
end
