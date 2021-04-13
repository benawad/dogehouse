defmodule Broth.Message.Room.DeleteScheduled do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    field(:roomId, :binary_id)
  end

  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:roomId])
    |> validate_required([:roomId])
    |> UUID.normalize(:roomId)
  end

  defmodule Reply do
    use Broth.Message.Push, operation: "room:delete_scheduled:reply"

    @primary_key false
    embedded_schema do
      field(:error, :map)
    end
  end
end
