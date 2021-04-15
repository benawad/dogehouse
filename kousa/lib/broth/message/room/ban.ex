defmodule Broth.Message.Room.Ban do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:id, :binary_id)
  end

  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:id])
    |> validate_required([:id])
    |> UUID.normalize(:id)
  end

  def execute(changeset, state) do
    with {:ok, ban} <- apply_action(changeset, :validate) do
      # TODO: change to auth: format.
      Kousa.Room.block_from_room(state.user_id, ban.id)
      {:noreply, state}
    end
  end
end
