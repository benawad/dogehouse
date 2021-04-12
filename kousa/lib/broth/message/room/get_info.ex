defmodule Broth.Message.Room.GetInfo do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    # required.
    field(:roomId, :binary_id)
  end

  import Ecto.Changeset
  alias Kousa.Utils.UUID

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:roomId])
    |> validate_required([:roomId])
    |> UUID.normalize(:roomId)
  end

  defmodule Reply do
    use Broth.Message.Push

    schema "rooms" do
    end
  end
end
