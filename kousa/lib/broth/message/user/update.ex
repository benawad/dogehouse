defmodule Broth.Message.User.Update do
  alias Beef.Schemas.User

  use Broth.Message.Call,
    schema: User,
    reply: User

  @impl true
  def initialize(state) do
    state.user
  end

  @impl true
  def changeset(initializer \\ %User{}, data) do
    initializer
    |> cast(data, [:muted, :deafened, :username, :bio, :displayName, :avatarUrl, :bannerUrl])
    |> validate_required([:username])
    |> unique_constraint(:username)
  end

  @impl true
  def execute(changeset, state) do
    # TODO: make this a proper changeset-mediated alteration.
    case Kousa.User.update_with(changeset) do
      {:ok, user} -> {:reply, user, %{state | user: user}}
      error -> error
    end
  end
end
