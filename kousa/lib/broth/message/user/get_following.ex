defmodule Broth.Message.User.GetFollowing do
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
    use Broth.Message.Push, operation: "user:get_following:reply"

    @derive {Jason.Encoder, only: [:following, :next_cursor]}

    @primary_key false
    embedded_schema do
      embeds_many(:following, Beef.Schemas.User)
      field(:next_cursor, :integer)
    end
  end

  def execute(changeset, state) do
    alias Beef.Follows

    with {:ok, request} <- apply_action(changeset, :validate),
         {users, next_cursor} = Follows.get_my_following(state.user_id, request.cursor) do
      {:reply, %Reply{following: users, next_cursor: next_cursor}, state}
    else
      error = {:error, %Ecto.Changeset{}} -> error
      other -> {:error, "#{inspect(other)}", state}
    end
  end
end
