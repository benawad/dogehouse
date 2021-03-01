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
        worker_module: Kousa.Gen.UserSession
      },
      {
        GenRegistry,
        worker_module: Kousa.Gen.RoomSession
      },
      {
        GenRegistry,
        worker_module: Kousa.Gen.RoomChat
      },
      {
        GenRegistry,
        worker_module: Kousa.Gen.VoiceRabbit
      },
      {
        GenRegistry,
        worker_module: Kousa.Gen.VoiceOnlineRabbit
      },
      {Beef.Repo, []},
      Kousa.Gen.StartRabbits,
      Kousa.Gen.StartRooms,
      Kousa.Gen.Telemetry,
      Plug.Cowboy.child_spec(
        scheme: :http,
        plug: Kousa.Router,
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
         {"/socket", Kousa.SocketHandler, []},
         {:_, Plug.Cowboy.Handler, {Kousa.Router, []}}
       ]}
    ]
  end
end
