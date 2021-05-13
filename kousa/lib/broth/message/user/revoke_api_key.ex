defmodule Broth.Message.User.RevokeApiKey do
  import Ecto.Query, warn: false
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userId])
    |> validate_required([:userId])
    |> Kousa.Utils.UUID.normalize(:userId)
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: ~w(
      id
      apiKey
    )a}

    @primary_key {:id, :binary_id, []}
    schema "users" do
      field(:apiKey, :string)
    end
  end

  alias Broth.SocketHandler

  def execute(changeset, %SocketHandler{} = state) do
    case apply_action(changeset, :validate) do
      {:ok, %{userId: bot_id}} ->
        case Kousa.User.revoke_api_key(state.user.id, bot_id) do
          {:ok, new_api_key} ->
            {:reply, %Reply{id: bot_id, apiKey: new_api_key}, state}

          error ->
            error
        end

      error ->
        error
    end
  end
end
