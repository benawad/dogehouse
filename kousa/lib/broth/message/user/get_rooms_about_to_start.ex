defmodule Broth.Message.User.GetRoomsAboutToStart do

  # TODO: consider deprecating this API endpoint.

  use Ecto.Schema

  @primary_key false
  embedded_schema do
  end

  import Ecto.Changeset

  def changeset(changeset, _data), do: change(changeset)

  defmodule Reply do
    use Ecto.Schema

    @primary_key false

    embedded_schema do
      embeds_many(:rooms, Beef.Schemas.Room)
    end
  end
end
