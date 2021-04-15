defmodule Broth.Message.Chat.Ban do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:id, :binary_id)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:id])
    |> validate_required([:id])
  end

  def execute(changeset, state) do
    with {:ok, ban} <- apply_action(changeset, :validate) do
      # TODO: change to by: format
      Kousa.RoomChat.ban_user(state.user_id, ban.id)
      {:noreply, state}
    end
  end
end
