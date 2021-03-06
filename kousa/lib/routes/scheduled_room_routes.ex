defmodule Kousa.Routes.ScheduledRoom do
  import Plug.Conn

  alias Kousa.Data.ScheduledRoom
  alias Ecto.UUID

  use Plug.Router

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
          Poison.encode!(%{room: ScheduledRoom.get_by_id(uuid)})
        )

      _ ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(
          200,
          Poison.encode!(%{error: "invalid id"})
        )
    end
  end
end
