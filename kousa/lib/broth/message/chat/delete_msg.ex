defmodule Broth.Message.Chat.DeleteMsg do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:messageId, :binary_id)
    field(:userId, :binary_id)
  end

  import Ecto.Changeset

  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:messageId, :userId])
    |> validate_required([:messageId, :userId])
    |> UUID.normalize(:messageId)
    |> UUID.normalize(:userId)
  end
end
