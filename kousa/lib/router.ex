defmodule Kousa.Router do
  import Plug.Conn

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

  forward("/auth/github", to: Kousa.GitHubAuth)
  forward("/auth/twitter", to: Kousa.TwitterAuth)
  # forward("/me", to: Kousa.Me)
  forward("/dev", to: Kousa.Dev)

  get _ do
    conn
    |> send_resp(404, "not found")
  end

  post _ do
    conn
    |> send_resp(404, "not found")
  end
end
