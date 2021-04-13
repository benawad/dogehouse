defmodule Broth.Message.Room.SetRole do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
    field(:role, Broth.Message.Types.RoomRole)
  end
  
  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userId, :role])
    |> validate_required([:userId, :role])
    |> UUID.normalize(:userId)
  end

  def execute(%{userId: user_id, role: role}, state) do
    Kousa.Room.set_role(user_id, role, by: state.user_id)
    {:ok, state}
  end
end
