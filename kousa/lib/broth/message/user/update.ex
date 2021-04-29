defmodule Broth.Message.User.Update do
  alias Beef.Schemas.User

  use Broth.Message.Call,
    schema: User,
    reply: __MODULE__

  @impl true
  def initialize(state) do
    state.user
  end

  @impl true
  def changeset(initializer \\ %User{}, data) do
    initializer
    |> cast(data, [:muted, :deafened, :username, :bio, :displayName, :avatarUrl, :bannerUrl])
    |> validate_required([:username])
  end

  @impl true
  def execute(changeset, state) do
    # TODO: make this a proper changeset-mediated alteration.
    with {:ok, update} <- apply_action(changeset, :validate),
         {:ok, user} <- Kousa.User.update(state.user.id, Map.from_struct(update)) do
      case user do
        %{isUsernameTaken: _} ->
          {:reply, %{isUsernameTaken: true}, state}

        _ ->
          {:reply, struct(User, Map.from_struct(user)), state}
      end
    end
  end
end
