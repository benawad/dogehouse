defmodule Broth.Routes.Room do
  import Plug.Conn

  alias Beef.Rooms
  alias Ecto.UUID

  use Plug.Router

  plug(Broth.Plugs.Cors)
  plug(:match)
  plug(:dispatch)

  get "/:id" do
    %Plug.Conn{params: %{"id" => id}} = conn

    case UUID.cast(id) do
      {:ok, uuid} ->
        room = Rooms.get_room_by_id(uuid)

        cond do
          is_nil(room) ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(
              400,
              Jason.encode!(%{error: "room does not exist"})
            )

          room.isPrivate ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(
              400,
              Jason.encode!(%{error: "room is not public"})
            )

          true ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(
              200,
              Jason.encode!(%{room: room})
            )
        end

      _ ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(
          400,
          Jason.encode!(%{error: "invalid id"})
        )
    end
  end
end
