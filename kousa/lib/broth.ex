defmodule Broth do
  import Plug.Conn

  @type json :: String.t() | number | boolean | nil | [json] | %{String.t() => json}

  alias Broth.Routes.DevOnly
  alias Broth.Routes.GitHubAuth
  alias Broth.Routes.TwitterAuth
  alias Broth.Routes.ScheduledRoom
  alias Broth.Routes.Room
  alias Broth.Routes.Stats

  use Plug.Router
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
  # forward("/me", to: Kousa.Me)
  forward("/dev", to: DevOnly)
  forward("/scheduled-room", to: ScheduledRoom)
  forward("/room", to: Room)
  forward("/stats", to: Stats)

  get _ do
    send_resp(conn, 404, "not found")
  end

  post _ do
    send_resp(conn, 404, "not found")
  end
end
