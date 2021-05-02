defmodule Broth.Message.User.GetFollowers do
  use Broth.Message.Call

  alias Kousa.Utils.UUID

  @primary_key false
  embedded_schema do
    # TODO: add a userId key in here.
    field(:username, :string)
    field(:cursor, :integer, default: 0)
    field(:limit, :integer, default: 100)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:cursor, :limit, :username])
    |> validate_number(:limit, greater_than: 0, message: "too low")
    |> UUID.normalize(:userId)
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: [:followers, :nextCursor, :initial]}
    @primary_key false
    embedded_schema do
      embeds_many(:followers, Beef.Schemas.User)
      field(:nextCursor, :integer)
      field(:initial, :boolean)
    end
  end

  def execute(changeset, state) do
    # currently limit is unused.
    with {:ok, %{username: username, cursor: cursor, limit: _limit}} <-
           apply_action(changeset, :validate) do
      {users, next_cursor} =
        if is_nil(username) do
          Kousa.Follow.get_follow_list(state.user.id, state.user.id, false, cursor)
        else
          Kousa.Follow.get_follow_list_by_username(state.user.id, username, false, cursor)
        end

      {:reply, %Reply{followers: users, nextCursor: next_cursor, initial: cursor == 0}, state}
    end
  end
end
