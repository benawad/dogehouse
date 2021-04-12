defmodule Broth.Message.Room.SetAuth do
  use Broth.Message, call: false

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
    field(:level, Broth.Message.Types.RoomAuth)
  end

  import Ecto.Changeset

  alias Kousa.Utils.UUID

  def changeset(data, _state) do
    %__MODULE__{}
    |> cast(data, [:userId, :level])
    |> validate_required([:userId, :level])
    |> UUID.normalize(:userId)
  end
end
