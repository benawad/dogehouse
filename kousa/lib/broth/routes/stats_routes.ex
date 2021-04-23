defmodule Broth.Routes.Stats do
  import Plug.Conn

  use Plug.Router

  plug(Broth.Plugs.Cors)
  plug(:match)
  plug(:dispatch)

  get "/" do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(400, Poison.encode!(%{"error" => "no"}))
  end
end
