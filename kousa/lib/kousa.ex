defmodule Kousa do
  use Application
  #
  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    Kousa.Metric.PrometheusExporter.setup()
    Kousa.Metric.PipelineInstrumenter.setup()
    Kousa.Metric.UserSessions.setup()

    children = [
      {
        GenRegistry,
        worker_module: Onion.UserSession
      },
      {
        GenRegistry,
        worker_module: Onion.RoomSession
      },
      {
        GenRegistry,
        worker_module: Onion.RoomChat
      },
      {
        GenRegistry,
        worker_module: Onion.VoiceRabbit
      },
      {
        GenRegistry,
        worker_module: Onion.VoiceOnlineRabbit
      },
      {Beef.Repo, []},
      Onion.Telemetry,
      Plug.Cowboy.child_spec(
        scheme: :http,
        plug: Broth,
        options: [
          port: String.to_integer(System.get_env("PORT") || "4001"),
          dispatch: dispatch(),
          protocol_options: [idle_timeout: :infinity]
        ]
      )
    ]

    opts = [strategy: :one_for_one, name: Kousa.Supervisor]

    case Supervisor.start_link(children, opts) do
      {:ok, pid} ->
        start_rabbits()
        start_rooms()
        {:ok, pid}

      error ->
        error
    end
  end

  defp dispatch do
    [
      {:_,
       [
         {"/socket", Broth.SocketHandler, []},
         {:_, Plug.Cowboy.Handler, {Broth, []}}
       ]}
    ]
  end

  defp start_rooms() do
    Enum.each(Beef.Rooms.all_rooms(), fn room ->
      GenRegistry.lookup_or_start(Onion.RoomSession, room.id, [
        %{
          room_id: room.id,
          voice_server_id: room.voiceServerId
        }
      ])
    end)
  end

  defp start_rabbits() do
    n = Application.get_env(:kousa, :num_voice_servers, 1) - 1

    Enum.each(0..n, fn x ->
      str_id = Kousa.Utils.VoiceServerUtils.idx_to_str_id(x)

      GenRegistry.lookup_or_start(Onion.VoiceRabbit, str_id, [
        %Onion.VoiceRabbit.State{id: str_id, chan: nil}
      ])

      GenRegistry.lookup_or_start(Onion.VoiceOnlineRabbit, str_id, [
        %Onion.VoiceOnlineRabbit.State{id: str_id, chan: nil}
      ])
    end)
  end
end
