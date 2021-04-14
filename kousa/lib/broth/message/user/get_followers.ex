defmodule Broth.Message.User.GetFollowers do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    # TODO: add a userId key in here.
    field(:cursor, :integer, default: 0)
    field(:limit, :integer, default: 100)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:cursor, :limit])
    |> validate_number(:limit, greater_than: 0, message: "too low")
  end

  def execute(changeset, state) do
    raise "ZZZ"
  end

  defmodule Reply do
    use Broth.Message.Push, operation: "user:get_followers:reply"

    @primary_key false

    embedded_schema do
      embeds_many(:followers, Beef.Schemas.User)
      field(:nextCursor, :integer)
      field(:initial, :boolean)
    end
  end
end
