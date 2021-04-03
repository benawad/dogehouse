defmodule Broth.Message.User.Follow do
  use Ecto.Schema

  @primary_key false
  embedded_schema do
    field(:followId, :binary_id)
  end

  import Ecto.Changeset

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:followId])
    |> validate_required([:followId])
  end
end
