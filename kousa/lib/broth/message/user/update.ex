defmodule Broth.Message.User.Update do
  use Broth.Message.Call, reply: __MODULE__

  alias Beef.Repo

  @derive {Jason.Encoder, only: ~w(
    username
    muted
    error
  )a}

  @primary_key {:id, :binary_id, []}
  schema "users" do
    field :username, :string

    field :muted, :boolean, virtual: true
    embed_error()
  end

  def tag, do: "user:update:reply"

  def changeset(data, state) when not is_struct(data) do
    __MODULE__
    |> Repo.get(state.user_id)
    |> cast(data, [:muted, :username])
    |> validate_required(:username)
  end

  def changeset(original_message, data) do
    payload = %__MODULE__{}
    |> cast(data, [:muted, :username, :error])
    |> apply_action!(:validate)

    original_message
    |> change
    |> put_change(:payload, payload)
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
