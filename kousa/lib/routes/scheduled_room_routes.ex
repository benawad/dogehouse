defmodule Kousa.Routes.ScheduledRoom do
  import Plug.Conn

  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/" do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(
      200,
      Poison.encode!(%{ok: true})
    )
  end
end
