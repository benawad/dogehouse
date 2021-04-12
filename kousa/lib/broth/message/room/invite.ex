defmodule Broth.Message.Room.Invite do
  use Broth.Message, call: false

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
  end

  import Ecto.Changeset

  def changeset(data, _state) do
    %__MODULE__{}
    |> cast(data, [:userId])
    |> validate_required([:userId])
  end
end
