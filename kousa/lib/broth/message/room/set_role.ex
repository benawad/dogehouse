defmodule Broth.Message.Room.SetRole do
  use Ecto.Schema

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
    field(:role, Broth.Message.Types.RoomRole)
  end

  import Ecto.Changeset
  alias Kousa.Utils.UUID

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:userId, :role])
    |> validate_required([:userId, :role])
    |> UUID.normalize(:userId)
  end
end
