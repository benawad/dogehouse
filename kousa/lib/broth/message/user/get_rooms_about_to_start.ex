defmodule Broth.Message.User.GetRoomsAboutToStart do
  # TODO: consider deprecating this API endpoint.

  use Broth.Message.Call

  @primary_key false
  embedded_schema do
  end

  import Ecto.Changeset

  def changeset(changeset, _data), do: change(changeset)

  defmodule Reply do
    use Broth.Message.Push, operation: "user:get_rooms_about_to_start"

    @primary_key false

    embedded_schema do
      embeds_many(:rooms, Beef.Schemas.ScheduledRoom)
    end
  end
end
