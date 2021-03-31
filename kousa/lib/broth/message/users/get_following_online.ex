defmodule Broth.Message.Users.GetFollowingOnline do
  use Ecto.Schema

  @primary_key false
  embedded_schema do
    field :cursor, :integer, default: 0
    field :limit, :integer, default: 100
  end

  import Ecto.Changeset

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:cursor, :limit])
    |> validate_number(:limit, less_than_or_equal_to: 100, message: "too high")
  end

  defmodule Reply do
    use Ecto.Schema

    @primary_key false

    embedded_schema do
      embeds_many :followers, Beef.Schemas.User
      field :next_cursor, :integer
      field :initial, :boolean
    end
  end
end
