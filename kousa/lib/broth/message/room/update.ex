defmodule Broth.Message.Room.Update do
  alias Beef.Schemas.Room

  use Broth.Message.Call,
    schema: Room,
    reply: Room

  @derive {Jason.Encoder,
           only: ~w(id name description numPeopleInside isPrivate chatMode autoSpeaker
    creatorId voiceServerId inserted_at)a}

  @impl true
  def initialize(state) do
    Beef.Rooms.get_room_by_creator_id(state.user.id)
  end

  @impl true
  def changeset(nil, _) do
    %Ecto.Changeset{}
    # generally 404 on an auth error
    |> add_error(:id, "does not exist")
  end

  @impl true
  def changeset(initializer, data) do
    initializer
    |> cast(data, ~w(description isPrivate name autoSpeaker chatMode)a)
    |> validate_required([:name])
  end

  @impl true
  def execute(changeset, state) do
    # TODO: move this changeset stuff into Kousa itself.
    with {:ok, update} <- apply_action(changeset, :validate),
         {:ok, room} <- Kousa.Room.update(state.user.id, Map.from_struct(update)) do
      changes = changeset.changes

      if Map.has_key?(changes, :isPrivate) do
        # send the room_privacy_change message.
        Onion.RoomSession.broadcast_ws(
          room.id,
          %{
            op: "room_privacy_change",
            d: %{roomId: room.id, name: room.name, isPrivate: changes.isPrivate}
          }
        )
      end

      if Map.has_key?(changes, :autoSpeaker) do
        # send the room_privacy_change message.
        Onion.RoomSession.set_auto_speaker(
          room.id,
          changes.autoSpeaker
        )
      end

      if Map.has_key?(changes, :chatMode) do
        # send the room_privacy_change message.
        Onion.Chat.set(
          room.id,
          :chat_mode,
          changes.chatMode
        )
      end

      {:reply, room, state}
    end
  end
end
