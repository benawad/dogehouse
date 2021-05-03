defmodule Broth.Message.User.Unblock do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
  end

  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userId])
    |> validate_required([:userId])
    |> UUID.normalize(:userId)
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: []}

    @primary_key false
    embedded_schema do
    end
  end

  alias Beef.UserBlocks
  alias Broth.SocketHandler

  def execute(changeset, %SocketHandler{} = state) do
    with {:ok, %{userId: user_id}} <- apply_action(changeset, :validate) do
      UserBlocks.delete(state.user.id, user_id)

      {:reply, %Reply{},
       %{
         state
         | user_ids_i_am_blocking: Enum.filter(state.user_ids_i_am_blocking, &(&1 != user_id))
       }}
    end
  end
end
