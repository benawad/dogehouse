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

    use Broth.Message.Push

    @derive {Jason.Encoder, only: [:blocked, :error]}

    @primary_key false
    embedded_schema do
      field(:blocked, {:array, :binary_id})
      # field is nil when there is no error.
      field(:error, :string)
    end
  end

  alias Broth.SocketHandler

  def execute(changeset, %SocketHandler{} = state) do
    with {:ok, %{userId: user_id}} <- apply_action(changeset, :validate),
         {:ok, %{userIdBlocked: blocked}} <- Kousa.UserBlock.block(state.user.id, user_id) do
      # TODO: update this to return a full user update.
      {:reply, %Reply{blocked: [blocked]},
       %{state | user_ids_i_am_blocking: [user_id | state.user_ids_i_am_blocking]}}
    else
      error = {:error, %Ecto.Changeset{}} ->
        error

      {:error, _error} ->
        user_id = get_field(changeset, :userId)
        {:reply, %Reply{error: "error blocking #{user_id}"}, state}
    end
  end
end
