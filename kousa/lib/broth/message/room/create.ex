defmodule Broth.Message.Room.Create do
  use Broth.Message.Call,
    reply: __MODULE__

  @derive {Jason.Encoder, only: [:id, :creatorId, :name, :description, :isPrivate]}

  @primary_key {:id, :binary_id, []}
  schema "rooms" do
    field(:creatorId, :binary_id)
    field(:name, :string)
    field(:description, :string)
    field(:isPrivate, :boolean, default: false)
    field(:userIdToInvite, {:array, :binary_id}, virtual: true)
    field(:autoSpeaker, :boolean, virtual: true)
  end

  # inbound data.
  @spec changeset(
          {map, map}
          | %{
              :__struct__ => atom | %{:__changeset__ => map, optional(any) => any},
              optional(atom) => any
            },
          :invalid | %{optional(:__struct__) => none, optional(atom | binary) => any}
        ) :: Ecto.Changeset.t()
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:name, :description, :isPrivate, :userIdToInvite, :autoSpeaker])
    |> validate_required([:name])
  end

  def execute(changeset!, state) do
    changeset! = put_change(changeset!, :creatorId, state.user_id)

    # TODO: pass the changeset to the create_room and avoid the validation
    # step.
    with {:ok, room_spec} <- apply_action(changeset!, :validation),
         {:ok, %{room: room}} <-
           Kousa.Room.create_room(
             state.user_id,
             room_spec.name,
             room_spec.description,
             room_spec.isPrivate,
             room_spec.userIdToInvite
           ) do
      {:reply, struct(__MODULE__, Map.from_struct(room)), state}
    end
  end
end
