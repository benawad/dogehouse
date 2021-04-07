defmodule Broth do
  import Plug.Conn

  alias Broth.Routes.GitHubAuth
  alias Broth.Routes.TwitterAuth
  alias Broth.Routes.ScheduledRoom
  alias Broth.Routes.Dev

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
  forward("/dev", to: Dev)
  forward("/scheduled-room", to: ScheduledRoom)

  get _ do
    send_resp(conn, 404, "not found")
  end

  post _ do
    send_resp(conn, 404, "not found")
  end
end
