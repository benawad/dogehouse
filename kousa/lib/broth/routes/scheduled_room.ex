defmodule Broth.Routes.ScheduledRoom do
  import Plug.Conn

  alias Beef.ScheduledRooms
  alias Ecto.UUID

  use Plug.Router

  plug(Broth.Plugs.Cors)
  plug(:match)
  plug(:dispatch)

  get "/:id" do
    %Plug.Conn{params: %{"id" => id}} = conn

    case UUID.cast(id) do
      {:ok, uuid} ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(
          200,
          Jason.encode!(%{room: ScheduledRooms.get_by_id(uuid)})
        )

      _ ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(
          200,
          Jason.encode!(%{error: "invalid id"})
        )
    end
  end
end
