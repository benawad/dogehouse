defmodule Broth.Message.User.AdminUpdate do
  alias Beef.Schemas.User

  use Broth.Message.Call,
    reply: User

  @primary_key false
  embedded_schema do
    field(:username, :string)
    embeds_one(:user, User)
  end

  alias Beef.Users

  def user_changeset(user = %User{}, data) do
    user
    |> cast(data, [:staff, :contributions])
  end

  @impl true
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:username])
    |> validate_required([:username])
    |> cast_embed(:user, with: &user_changeset/2, required: true)
  end

  alias Broth.SocketHandler

  @impl true
  def execute(changeset, %SocketHandler{} = state) do
    with {:ok, %{username: username, user: user_data}} <- apply_action(changeset, :validate) do
      user_to_change = Users.get_by_username(username)
      state.user

      # @todo we are changing the values for another user
      # we need to update the cached data in that users ws
      case Kousa.User.admin_update_with(
             user_to_change |> user_changeset(Map.from_struct(user_data)),
             state.user
           ) do
        {:ok, user} -> {:reply, user, state}
        error -> error
      end
    end
  end
end
