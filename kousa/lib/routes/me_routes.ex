defmodule Kousa.Routes.Me do
  import Plug.Conn

  use Plug.Router

  # alias Beef.Users

  plug(Kousa.CheckAuth, %{shouldThrow: false})
  plug(:match)
  plug(:dispatch)

  get "/" do
    user =
      cond do
        conn.assigns[:user] -> conn.assigns[:user]
        conn.assigns[:user_id] -> Beef.Users.get_by_id(conn.assigns[:user_id])
        true -> nil
      end

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(%{"user" => user}))
  end
end
