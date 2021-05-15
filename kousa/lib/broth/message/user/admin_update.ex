defmodule Broth.Message.User.AdminUpdate do
  alias Beef.Schemas.User

  use Broth.Message.Call,
    reply: User

  @primary_key false
  embedded_schema do
    field(:id, :binary_id)
    embeds_one(:user, User)
  end

  alias Beef.Users

  def user_admin_changeset(_, data, user) do
    user
    |> cast(data, [:staff, :contributions])
  end

  @impl true
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:id])
    |> validate_required([:id])
    |> cast_embed(:user,
      with:
        {__MODULE__, :user_admin_changeset,
         [
           if(not is_nil(data["id"]),
             do: Users.get_by_id(data["id"]),
             else: %User{}
           )
         ]},
      required: true
    )
  end

  alias Broth.SocketHandler

  @impl true
  def execute(changeset, %SocketHandler{} = state) do
    with %Ecto.Changeset{changes: %{user: user_changeset}} <- changeset do
      # @todo we are changing the values for another user
      # we need to update the cached data in that users ws
      case Kousa.User.admin_update_with(
             %{user_changeset | action: :update},
             state.user
           ) do
        {:ok, user} -> {:reply, user, state}
        error -> error
      end
    end
  end
end
