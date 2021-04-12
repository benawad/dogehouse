defmodule Broth.Message.User.GetScheduledRooms do
  # TODO: consider deprecating this API endpoint.
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
  end

  import Ecto.Changeset

  def changeset(changeset, _data), do: change(changeset)

  defmodule Reply do
    use Broth.Message.Push, operation: "user:get_scheduled_rooms:reply"

    @primary_key false

    embedded_schema do
      embeds_many(:rooms, Beef.Schemas.ScheduledRoom)
    end
  end
end
