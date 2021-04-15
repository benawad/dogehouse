defmodule Broth.Message.Room.SetRole do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:id, :binary_id)
    field(:role, Broth.Message.Types.RoomRole)
  end

  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:id, :role])
    |> validate_required([:id, :role])
    |> UUID.normalize(:id)
  end

  def execute(changeset, state) do
    with {:ok, %{id: user_id, role: role}} <- apply_action(changeset, :validate) do
      Kousa.Room.set_role(user_id, role, by: state.user_id)
      {:noreply, state}
    end
  end
end
