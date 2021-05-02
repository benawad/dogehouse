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
    use Broth.Message.Push

    @derive {Jason.Encoder, only: []}

    @primary_key false
    embedded_schema do
    end
  end

  def execute(changeset, state) do
    with {:ok, %{roomId: room_id}} <- apply_action(changeset, :validate) do
      Kousa.ScheduledRoom.delete(state.user.id, room_id)
      {:reply, %Reply{}, state}
    end
  end
end
