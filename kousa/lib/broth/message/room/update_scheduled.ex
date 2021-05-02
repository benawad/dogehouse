defmodule Broth.Message.Room.UpdateScheduled do
  use Broth.Message.Call,
    reply: __MODULE__

  alias Beef.Repo

  @derive {Jason.Encoder, only: [:name, :scheduledFor, :description]}
  @primary_key {:id, :binary_id, []}
  schema "scheduled_rooms" do
    field(:name, :string)
    field(:scheduledFor, :utc_datetime_usec)
    field(:description, :string, default: "")
  end

  import Broth.Message.Room.CreateScheduled, only: [validate_future: 1]

  def changeset(initializer \\ %__MODULE__{}, data)

  def changeset(_, data)
      when not is_map_key(data, "id") or
             is_nil(:erlang.map_get("id", data)) do
    id_error("can't be blank")
  end

  def changeset(_, data) do
    case Repo.get(__MODULE__, data["id"]) do
      nil ->
        id_error("room not found")

      room ->
        room
        |> cast(data, [:name, :scheduledFor, :description])
        |> validate_required([:name, :scheduledFor])
        |> validate_future
    end
  end

  def id_error(message) do
    %__MODULE__{}
    |> change
    |> add_error(:id, message)
  end

  def execute(changeset, state) do
    with {:ok, update} <- apply_action(changeset, :validate),
         update_data = update |> Map.from_struct() |> Map.delete(:id),
         :ok <- Kousa.ScheduledRoom.edit(state.user.id, update.id, update_data) do
      {:reply, Repo.get(__MODULE__, update.id), state}
    end
  end
end
