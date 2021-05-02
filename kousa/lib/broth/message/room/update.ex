defmodule Broth.Message.Room.Update do
  use Broth.Message.Call,
    reply: __MODULE__

  @derive {Jason.Encoder, only: [:name, :description, :isPrivate, :autoSpeaker]}

  @primary_key {:id, :binary_id, []}
  schema "rooms" do
    field(:name, :string)
    field(:description, :string, default: "")
    field(:isPrivate, :boolean)
    field(:autoSpeaker, :boolean, virtual: true)
  end

  def initialize(state) do
    if room = Beef.Rooms.get_room_by_creator_id(state.user.id) do
      struct(__MODULE__, Map.from_struct(room))
    end
  end

  def changeset(initializer \\ %__MODULE__{}, data)

  def changeset(nil, _) do
    %__MODULE__{}
    |> change
    # generally 404 on an auth error
    |> add_error(:id, "does not exist")
  end

  def changeset(initializer, data) do
    initializer
    |> cast(data, ~w(description isPrivate name autoSpeaker)a)
    |> validate_required([:name])
  end

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

      {:reply, struct(__MODULE__, Map.from_struct(room)), state}
    end
  end

  # a bit hacky -- will need to refactor using proper db changesets in
  # the future.
  def valid?({_, nil}), do: false
  def valid?({_, ""}), do: false
  def valid?(_), do: true
end
