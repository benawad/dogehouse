defmodule Broth.Message.Room.SetRole do
  use Broth.Message, call: false

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
    field(:role, Broth.Message.Types.RoomRole)
  end

  import Ecto.Changeset
  alias Kousa.Utils.UUID

  def changeset(data, _state) do
    %__MODULE__{}
    |> cast(data, [:userId, :role])
    |> validate_required([:userId, :role])
    |> UUID.normalize(:userId)
  end
end
