defmodule Broth do
  import Plug.Conn

  @type json :: String.t() | number | boolean | nil | [json] | %{String.t() => json}

  alias Broth.Routes.DevOnly
  alias Broth.Routes.GitHubAuth
  alias Broth.Routes.TwitterAuth
  alias Broth.Routes.DiscordAuth
  alias Broth.Routes.ScheduledRoom
  alias Broth.Routes.Room
  alias Broth.Routes.Stats
  alias Broth.Routes.BotAuth
  alias Broth.Routes.User
  use Plug.Router

  if Mix.env() == :test do
    plug(:set_callers)

    defp get_callers(%Plug.Conn{req_headers: req_headers}) do
      {_, request_bin} = Enum.find(req_headers, fn {key, _} -> key == "user-agent" end)

      List.wrap(
        if is_binary(request_bin) do
          request_bin
          |> Base.decode16!()
          |> :erlang.binary_to_term()
        end
      )
    end

    defp set_callers(conn, _params) do
      Process.put(:"$callers", get_callers(conn))
      conn
    end
  end

  use Sentry.PlugCapture
  plug(Broth.Plugs.Cors)
  plug(Kousa.Metric.PrometheusExporter)
  plug(:match)
  plug(:dispatch)

  options _ do
    send_resp(conn, 200, "")
  end

  forward("/auth/github", to: GitHubAuth)
  forward("/auth/twitter", to: TwitterAuth)
  forward("/auth/discord", to: DiscordAuth)
  # forward("/me", to: Kousa.Me)
  forward("/dev", to: DevOnly)
  forward("/scheduled-room", to: ScheduledRoom)
  forward("/room", to: Room)
  forward("/user", to: User)
  forward("/stats", to: Stats)
  forward("/bot", to: BotAuth)

  get _ do
    send_resp(conn, 404, "not found")
  end

  post _ do
    send_resp(conn, 404, "not found")
  end
end
