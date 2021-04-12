defmodule Broth.Message.User.GetInfo do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    # required.
    field(:userId, :binary_id)
  end

  import Ecto.Changeset
  alias Kousa.Utils.UUID

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:userId])
    |> validate_required([:userId])
    |> UUID.normalize(:userId)
  end

  defmodule Reply do
    use Broth.Message.Push

    @primary_key false
    schema "user" do
    end
  end
end
