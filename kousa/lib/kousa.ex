defmodule Kousa do
  use Application

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
      Onion.StartRabbits,
      Onion.StartRooms,
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
    Supervisor.start_link(children, opts)
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
end
