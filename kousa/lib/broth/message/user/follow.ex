defmodule Broth.Message.User.Follow do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:followId, :binary_id)
  end

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:followId])
    |> validate_required([:followId])
  end
end
