defmodule Broth.Message.Room.Create do
  use Broth.Message.Call,
    reply: __MODULE__

  @derive {Jason.Encoder,
           only: [
             :id,
             :creatorId,
             :name,
             :description,
             :isPrivate,
             :scheduledRoomId
           ]}

  @primary_key {:id, :binary_id, []}
  schema "rooms" do
    field(:creatorId, :binary_id)
    field(:name, :string)
    field(:description, :string)
    field(:isPrivate, :boolean, default: false)
    field(:userIdToInvite, {:array, :binary_id}, virtual: true)
    field(:autoSpeaker, :boolean)
    field(:scheduledRoomId, :binary_id, virtual: true)
  end

  # inbound data.
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [
      :name,
      :description,
      :isPrivate,
      :userIdToInvite,
      :autoSpeaker,
      :scheduledRoomId
    ])
    |> validate_required([:name])
  end

  alias Beef.ScheduledRooms

  def execute(changeset!, state) do
    changeset! = put_change(changeset!, :creatorId, state.user.id)

    # TODO: pass the changeset to the create_room and avoid the validation
    # step.
    with {:ok, room_spec} <- apply_action(changeset!, :validation),
         {:ok, %{room: room}} <-
           Kousa.Room.create_room(
             state.user.id,
             room_spec.name,
             room_spec.description || "",
             room_spec.isPrivate,
             room_spec.userIdToInvite,
             room_spec.autoSpeaker
           ) do
      case Ecto.UUID.cast(room_spec.scheduledRoomId) do
        {:ok, _} ->
          ScheduledRooms.room_started(state.user.id, room_spec.scheduledRoomId, room.id)

        _ ->
          nil
      end

      {:reply, struct(__MODULE__, Map.from_struct(room)), state}
    end
  end
end
