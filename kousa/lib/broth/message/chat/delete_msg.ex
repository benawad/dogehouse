defmodule Broth.Message.Chat.DeleteMsg do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:messageId, :binary_id)
    field(:userId, :binary_id)
  end

  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:messageId, :userId])
    |> validate_required([:messageId, :userId])
    |> UUID.normalize(:messageId)
    |> UUID.normalize(:userId)
  end

  def execute(changeset, state) do
    with {:ok, delete} <- apply_action(changeset, :validate) do
      Kousa.RoomChat.delete_message(state.user_id, delete.messageId, delete.userId)
      {:noreply, state}
    end
  end
end
