defmodule Broth.Message.User.Update do
  use Broth.Message.Call,
    reply: __MODULE__

  alias Beef.Repo

  @derive {Jason.Encoder, only: ~w(
    username
    muted
  )a}

  @primary_key {:id, :binary_id, []}
  schema "users" do
    field(:username, :string)
    field(:muted, :boolean, virtual: true)
  end

  def initialize(state) do
    Repo.get(__MODULE__, state.user_id)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:muted, :username])
    |> validate_required([:username])
  end

  def execute(changeset, state) do
    # TODO: make this a proper changeset-mediated alteration.
    with {:ok, update} <- apply_action(changeset, :validate),
         {:ok, user} <- Kousa.User.update(state.user_id, Map.from_struct(update)) do
      {:reply, struct(__MODULE__, Map.from_struct(user)), state}
    end
  end
end
