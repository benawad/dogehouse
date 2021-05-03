defmodule Broth.Message.Room.GetInfo do
  use Broth.Message.Call
  alias Beef.Repo

  @primary_key false
  embedded_schema do
    # not required.  If you don't supply it, you get the room id of the
    # current room you're in (if you are in one)
    field(:roomId, :binary_id)
  end

  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:roomId])
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
    with {:ok, request} <- apply_action(changeset, :validate) do
      room_id = request.roomId || Beef.Users.get_current_room_id(state.user.id)

      if room = room_id && Repo.get(Reply, room_id) do
        {:reply, room, state}
      else
        {:error, "the room doesn't exist"}
      end
    end
  end
end
