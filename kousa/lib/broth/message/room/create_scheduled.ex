defmodule Broth.Message.Room.CreateScheduled do
  use Broth.Message.Call,
    reply: __MODULE__

  @derive {Jason.Encoder, only: [:id, :name, :scheduledFor, :description]}

  @primary_key {:id, :binary_id, []}
  schema "scheduled_room" do
    field(:name, :string)
    field(:scheduledFor, :utc_datetime_usec)
    field(:description, :string, default: "")

    belongs_to(:creator, User, foreign_key: :creatorId, type: :binary_id)
  end

  @impl true
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:name, :scheduledFor, :description])
    |> validate_required([:name, :scheduledFor])
    |> validate_future
  end

  def validate_future(changeset = %{valid?: false}), do: changeset

  def validate_future(changeset) do
    changeset
    |> get_field(:scheduledFor)
    |> DateTime.compare(DateTime.utc_now())
    |> case do
      :lt -> add_error(changeset, :scheduledFor, "is in the past")
      _ -> changeset
    end
  end

  @impl true
  # TODO: this will be much cleaner when direct changeset posting is enabled.
  def execute(changeset, state) do
    with {:ok, room} <- apply_action(changeset, :validation),
         room_data = %{
           "name" => room.name,
           "scheduledFor" => room.scheduledFor,
           "description" => room.description
         },
         {:ok, s_room} <- Kousa.ScheduledRoom.schedule(state.user.id, room_data) do
      reply = %__MODULE__{
        id: s_room.id,
        name: s_room.name,
        scheduledFor: s_room.scheduledFor,
        description: s_room.description
      }

      {:reply, reply, state}
    end
  end
end
