defmodule Broth.Message.User.Update do
  use Broth.Message, call: __MODULE__

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
end
