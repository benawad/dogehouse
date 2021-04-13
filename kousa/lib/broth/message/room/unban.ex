defmodule Broth.Message.Room.Unban do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
  end

  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userId])
    |> validate_required([:userId])
    |> UUID.normalize(:userId)
  end

  defmodule Reply do
    use Broth.Message.Push, operation: "room:unban:reply"

    @derive {Jason.Encoder, only: [:error]}

    @primary_key false
    embedded_schema do
    end
  end
end
