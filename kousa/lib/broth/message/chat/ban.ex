defmodule Broth.Message.Chat.Ban do
  use Broth.Message, call: false

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
  end

  import Ecto.Changeset

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:userId])
    |> validate_required([:userId])
  end
end
