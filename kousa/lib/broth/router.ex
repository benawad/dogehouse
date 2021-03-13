defmodule Kousa.Router do
  import Plug.Conn

  alias Kousa.Routes.GitHubAuth
  alias Kousa.Routes.TwitterAuth
  alias Kousa.Routes.ScheduledRoom
  alias Kousa.Routes.Dev

  use Plug.Router
  use Sentry.PlugCapture
  plug(Kousa.Cors)
  plug(Kousa.Metric.PrometheusExporter)
  plug(:match)
  plug(:dispatch)

  options _ do
    conn
    |> send_resp(200, "")
  end

  forward("/auth/github", to: GitHubAuth)
  forward("/auth/twitter", to: TwitterAuth)
  # forward("/me", to: Kousa.Me)
  forward("/dev", to: Dev)
  forward("/scheduled-room", to: ScheduledRoom)

  get _ do
    conn
    |> send_resp(404, "not found")
  end

  post _ do
    conn
    |> send_resp(404, "not found")
  end
end
