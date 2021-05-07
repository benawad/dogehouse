defmodule Broth.Routes.User do
  import Plug.Conn

  alias Beef.Users
  alias Ecto.UUID

  use Plug.Router

  plug(Broth.Plugs.Cors)
  plug(:match)
  plug(:dispatch)

  get "/:id" do
    %Plug.Conn{params: %{"id" => id}} = conn
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(
          200,
          Poison.encode!(%{user: Users.get_by_username(id)})
        )
  end
end
