defmodule Kousa do
  use Application
  #
  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    Kousa.Metric.PrometheusExporter.setup()
    Kousa.Metric.PipelineInstrumenter.setup()
    Kousa.Metric.UserSessions.setup()

    children = [
      # top-level supervisor for UserSession group
      Onion.Supervisors.UserSession,
      Onion.Supervisors.RoomSession,
      Onion.Supervisors.Chat,
      Onion.Supervisors.VoiceRabbit,
      Onion.Supervisors.VoiceOnlineRabbit,
      Onion.BotAuthRateLimit,
      Onion.StatsCache,
      {Beef.Repo, []},
      {Phoenix.PubSub, name: Onion.PubSub},
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

    # TODO: make these into tasks

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
      Onion.RoomSession.start_supervised(
        room_id: room.id,
        voice_server_id: room.voiceServerId,
        chat_mode: room.chatMode,
        room_creator_id: room.creatorId
      )
    end)
  end

  # TODO: bake this into the supervision tree itself by having the
  # supervisor fetch and look up the the list of online voice servers
  # by querying GCP tags.
  defp start_rabbits() do
    n = Application.get_env(:kousa, :num_voice_servers, 1) - 1

    IO.puts("about to start_rabbits")

    0..n
    |> Enum.map(&Kousa.Utils.VoiceServerUtils.idx_to_str_id/1)
    |> Enum.each(fn id ->
      Onion.VoiceRabbit.start_supervised(id)
      Onion.VoiceOnlineRabbit.start_supervised(id)
    end)

    IO.puts("finished rabbits")
  end
end
