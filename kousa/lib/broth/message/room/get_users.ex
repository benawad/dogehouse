defmodule Broth.Message.Room.GetUsers do
  use Broth.Message.Call

  @primary_key {:id, :binary_id, []}
  embedded_schema do
    field(:cursor, :integer, default: 0)
    field(:limit, :integer, default: 100)
  end

  def initialize(state) do
    %__MODULE__{id: Beef.Users.get_current_room_id(state.user_id)}
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:id, :cursor, :limit])
    |> validate_required([:id], message: "you are not in a room")
    |> validate_number(:limit, greater_than: 0, message: "too low")
  end

  defmodule Reply do
    use Broth.Message.Push, operation: "room:get_users:reply"

    @primary_key false

    @derive {Jason.Encoder, only: [:users, :muteMap, :activeSpeakerMap, :roomId, :autoSpeaker]}

    embedded_schema do
      embeds_many(:users, Beef.Schemas.User)
      field(:muteMap, :map)
      field(:activeSpeakerMap, :map)
      field(:roomId, :binary_id)
      field(:autoSpeaker, :boolean)
    end
  end

  def execute(changeset, state) do
    with {:ok, request} <- apply_action(changeset, :validate),
         {room_id, users} = Beef.Users.get_users_in_current_room(state.user_id) do

      {muteMap, autoSpeaker, activeSpeakerMap} =
        if room_id do
          Onion.RoomSession.get_maps(room_id)
        else
          {%{}, false, %{}}
        end

      {:reply, %Reply{
        users: users,
        muteMap: muteMap,
        activeSpeakerMap: activeSpeakerMap,
        roomId: room_id,
        autoSpeaker: autoSpeaker
      }, state}
    end
  end
end
