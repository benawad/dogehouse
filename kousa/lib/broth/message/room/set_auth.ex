defmodule Broth.Message.Room.SetAuth do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
    field(:level, Broth.Message.Types.RoomAuth)
  end

  import Ecto.Changeset

  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userId, :level])
    |> validate_required([:userId, :level])
    |> UUID.normalize(:userId)
  end

  def execute(%{userId: user_id, level: level}, state) do
    Kousa.Room.set_auth(user_id, level, by: state.user_id)
    {:ok, state}
  end
end
