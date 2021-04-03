defmodule Broth.Message.Room.GetUsers do
  use Ecto.Schema

  @primary_key false
  embedded_schema do
    field(:cursor, :integer, default: 0)
    field(:limit, :integer, default: 100)
  end

  import Ecto.Changeset

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:cursor, :limit])
    |> validate_number(:limit, greater_than: 0, message: "too low")
  end

  defmodule Reply do
    use Ecto.Schema

    @primary_key false

    embedded_schema do
      embeds_many(:users, Beef.Schemas.User)
      field(:next_cursor, :integer)
      field(:initial, :boolean)
    end
  end
end
