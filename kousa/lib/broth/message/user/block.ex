defmodule Broth.Message.User.Block do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userId])
    |> validate_required([:userId])
  end

  defmodule Reply do
    # TODO: make the reply be a schema that returns the entire user
    # database object

    use Broth.Message.Push, operation: "user:block:reply"

    @derive {Jason.Encoder, only: [:blocked, :error]}

    @primary_key false
    embedded_schema do
      field(:blocked, {:array, :binary_id})
      # field is nil when there is no error.
      field(:error, :string)
    end
  end

  def execute(%{userId: user_id}, state) do
    case Kousa.UserBlock.block(state.user_id, user_id) do
      {:ok, %{userIdBlocked: blocked}} ->
        # TODO: update this to return a full user update.
        {:reply, %Reply{blocked: [blocked]}, state}

      {:error, _error} ->
        {:reply, %Reply{error: "error blocking #{user_id}"}, state}
    end
  end
end
