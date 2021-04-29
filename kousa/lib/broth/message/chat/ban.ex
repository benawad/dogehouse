defmodule Broth.Message.Chat.Ban do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userId])
    |> validate_required([:userId])
  end

  def execute(changeset, state) do
    with {:ok, %{userId: userId}} <- apply_action(changeset, :validate) do
      # TODO: change to by: format
      Kousa.Chat.ban_user(state.user.id, userId)
      {:noreply, state}
    end
  end
end
