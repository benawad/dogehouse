defmodule Broth.Message.Room.Update do
  use Broth.Message.Call,
    reply: __MODULE__,
    operation: "room:update:reply"

  @derive {Jason.Encoder, only: [:name, :description, :isPrivate, :autoSpeaker]}

  @primary_key {:id, :binary_id, []}
  schema "rooms" do
    field(:name, :string)
    field(:description, :string)
    field(:isPrivate, :boolean)
    field(:autoSpeaker, :boolean, virtual: true)
  end

  def initialize(state) do
    if room = Beef.Rooms.get_room_by_creator_id(state.user_id) do
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
    with {:ok, update} <- apply_action(changeset, :validate),
         {:ok, room} <- Kousa.Room.update(state.user_id, Map.from_struct(update)) do
      {:reply, struct(__MODULE__, Map.from_struct(room)), state}
    else
      error = {:error, %Ecto.Changeset{}} -> error
      {:error, msg} -> {:error, inspect(msg), state}
    end
  end

  # a bit hacky -- will need to refactor using proper db changesets in
  # the future.
  def valid?({_, nil}), do: false
  def valid?({_, ""}), do: false
  def valid?(_), do: true
end
