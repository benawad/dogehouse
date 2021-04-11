defmodule Broth.Message.Room.SetAuth do
  use Ecto.Schema

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
    field(:level, Broth.Message.Types.RoomAuth)
  end

  import Ecto.Changeset

  alias Kousa.Utils.UUID

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:userId, :level])
    |> validate_required([:userId, :level])
    |> UUID.normalize(:userId)
  end
end
