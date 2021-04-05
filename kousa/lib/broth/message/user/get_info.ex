defmodule Broth.Message.User.GetInfo do
  use Ecto.Schema

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
    use Ecto.Schema

    @primary_key false
    embedded_schema do
      embeds_one(:user, Beef.Schemas.User)
    end
  end
end
