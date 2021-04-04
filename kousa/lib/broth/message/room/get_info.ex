defmodule Broth.Message.Room.GetInfo do
  use Ecto.Schema

  @primary_key false
  embedded_schema do
    field :roomId, :binary_id # required.
  end

  import Ecto.Changeset
  alias Kousa.Utils.UUID
  def changeset(changeset, data) do
    changeset
    |> cast(data, [:roomId])
    |> validate_required([:roomId])
    |> UUID.normalize(:roomId)
  end

  defmodule Reply do
    use Ecto.Schema

    @primary_key false
    embedded_schema do
      embeds_one(:room, Beef.Schemas.Room)
    end
  end
end
