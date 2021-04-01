defmodule Broth.Message.Room.SetMod do
  use Ecto.Schema

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
    field(:isMod, :boolean)
  end

  import Ecto.Changeset

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:userId, :isMod])
    |> validate_required([:userId, :isMod])
  end
end
