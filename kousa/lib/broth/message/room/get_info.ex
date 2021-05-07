defmodule Broth.Message.Room.GetInfo do
  use Broth.Message.Call

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

    @derive {Jason.Encoder, only: [:room, :users, :muteMap, :deafMap, :activeSpeakerMap, :roomId]}

    @primary_key false
    schema "rooms" do
      field(:room, :map)
      embeds_many(:users, Beef.Schemas.User)
      field(:muteMap, :map)
      field(:deafMap, :map)
      field(:activeSpeakerMap, :map)
      field(:roomId, :string)
    end
  end

  def execute(changeset, state) do
    with {:ok, request} <- apply_action(changeset, :validate) do
      room_id = request.roomId || Beef.Users.get_current_room_id(state.user.id)

      case Onion.RoomSession.lookup(room_id) do
        [] ->
          {:error, "the room doesn't exist"}

        _ ->
          room = Beef.Rooms.get_room_by_id(room_id)
          {_, users} = Beef.Users.get_users_in_current_room(state.user.id)
          {muteMap, deafMap, _, activeSpeakerMap} = Onion.RoomSession.get_maps(room_id)

          {:reply,
           %Reply{
             room: room,
             users: users,
             muteMap: muteMap,
             deafMap: deafMap,
             activeSpeakerMap: activeSpeakerMap,
             roomId: room_id
           }, state}
      end
    end
  end
end
