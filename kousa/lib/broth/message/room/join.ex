defmodule Broth.Message.Room.Join do
  use Broth.Message.Call
  alias Beef.Repo

  @primary_key false
  embedded_schema do
    field(:roomId, :binary_id)
  end

  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:roomId])
    |> validate_required([:roomId])
    |> UUID.normalize(:roomId)
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: [:id, :name, :description, :isPrivate]}

    @primary_key {:id, :binary_id, []}
    schema "rooms" do
      field(:name, :string)
      field(:description, :string)
      field(:isPrivate, :boolean)
    end
  end

  def execute(changeset, state) do
    with {:ok, %{roomId: room_id}} <- apply_action(changeset, :validate) do
      case Kousa.Room.join_room(state.user.id, room_id) do
        %{error: error} ->
          {:error, error, state}

        _ ->
          {:reply, Repo.get(Reply, room_id), state}
      end
    end
  end
end
