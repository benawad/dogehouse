defmodule Broth.Message.Room.Block do
  use Ecto.Schema

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
  end

  import Ecto.Changeset
  alias Kousa.Utils.UUID

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:userId])
    |> validate_required([:userId])
    |> UUID.normalize(:userId)
  end
end
