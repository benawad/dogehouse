defmodule Broth.Message.Room.SetRole do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
    field(:role, Broth.Message.Types.RoomRole)
  end

  alias Kousa.Utils.UUID

  def initialize(state) do
    # TODO: obtain the initial state of this first prior to changing it.
    %__MODULE__{userId: state.user.id}
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userId, :role])
    # if we don't have an id, assume self.
    |> validate_required([:userId, :role])
    |> UUID.normalize(:id)
  end

  def execute(changeset, state) do
    with {:ok, %{userId: user_id, role: role}} <- apply_action(changeset, :validate) do
      Kousa.Room.set_role(user_id, role, by: state.user.id)
      {:noreply, state}
    end
  end
end
