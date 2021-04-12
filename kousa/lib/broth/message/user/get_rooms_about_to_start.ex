defmodule Broth.Message.User.GetRoomsAboutToStart do
  # TODO: consider deprecating this API endpoint.

  use Broth.Message.Call

  @primary_key false
  embedded_schema do
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    change(initializer, data)
  end

  defmodule Reply do
    use Broth.Message.Push, operation: "user:get_rooms_about_to_start"

    @primary_key false

    embedded_schema do
      embeds_many(:rooms, Beef.Schemas.ScheduledRoom)
    end
  end
end
