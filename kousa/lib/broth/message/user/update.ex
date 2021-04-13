defmodule Broth.Message.User.Update do
  use Broth.Message.Call,
    reply: __MODULE__,
    operation: "user:update:reply"

  alias Beef.Repo

  @derive {Jason.Encoder, only: ~w(
    username
    muted
    error
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
    |> validate_required([:id, :username])
  end

  def execute(data, state) do
    # TODO: make this a proper changeset-mediated alteration.
    case Kousa.User.update(state.user_id, Map.from_struct(data)) do
      {:error, changeset} ->
        # TODO: make this better:
        error = Kousa.Utils.Errors.changeset_to_first_err_message(changeset)
        {:reply, %{error: error}, state}

      {:ok, user} ->
        {:reply, Map.from_struct(user), state}
    end
  end
end
