defmodule Broth.Message.Room.GetBannedUsers do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    field(:cursor, :integer, default: 0)
    field(:limit, :integer, default: 100)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:cursor, :limit])
    |> validate_number(:limit, greater_than: 0, message: "too low")
  end

  defmodule Reply do
    use Broth.Message.Push

    @primary_key false

    @derive {Jason.Encoder, only: [:users, :nextCursor]}

    embedded_schema do
      embeds_many(:users, Beef.Schemas.User)
      field(:nextCursor, :integer)
    end
  end

  alias Kousa.RoomBlock

  def execute(changeset, state) do
    with {:ok, request} <- apply_action(changeset, :validate) do
      case RoomBlock.get_blocked_users(state.user.id, request.cursor) do
        {users, next_cursor} ->
          {:reply, %Reply{users: users, nextCursor: next_cursor}, state}

        _ ->
          {:reply, %Reply{users: [], nextCursor: nil}, state}
      end
    end
  end
end
