defmodule Broth.Message.User.GetFollowing do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    field(:username, :string)
    field(:cursor, :integer, default: 0)
    field(:limit, :integer, default: 100)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:cursor, :limit, :username])
    |> validate_number(:limit, greater_than: 0, message: "too low")
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: [:following, :nextCursor]}

    @primary_key false
    embedded_schema do
      embeds_many(:following, Beef.Schemas.User)
      field(:nextCursor, :integer)
      field(:initial, :boolean)
    end
  end

  def execute(changeset, state) do
    alias Beef.Follows

    with {:ok, request} <- apply_action(changeset, :validate) do
      {users, next_cursor} =
        if is_nil(request.username) do
          Follows.get_my_following(state.user.id, request.cursor)
        else
          Kousa.Follow.get_follow_list_by_username(
            state.user.id,
            request.username,
            true,
            request.cursor
          )
        end

      {:reply,
       %Reply{
         following: users,
         nextCursor: next_cursor,
         initial: request.cursor == 0
       }, state}
    end
  end
end
