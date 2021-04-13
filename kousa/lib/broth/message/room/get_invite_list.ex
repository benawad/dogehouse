defmodule Broth.Message.Room.GetInviteList do
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
    use Broth.Message.Push, operation: "room:get_invite_list:reply"

    @derive {Jason.Encoder, only: [:invites, :next_cursor]}

    @primary_key false
    embedded_schema do
      embeds_many(:invites, Beef.Schemas.User)
      field(:next_cursor, :integer)
    end
  end

  def execute(changeset, state) do
    with {:ok, get_request} <- apply_action(changeset, :validate),
         {users, next_cursor} <- Beef.Follows.fetch_invite_list(state.user_id, get_request.cursor) do

      {:reply, %Reply{invites: users, next_cursor: next_cursor}, state}
    else
      error = {:error, %Ecto.Changeset{}} -> error
      other -> {:error, "#{inspect other}", state}
    end
  end
end
