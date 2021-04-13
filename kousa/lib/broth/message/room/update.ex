defmodule Broth.Message.Room.Update do
  use Broth.Message.Call,
    reply: __MODULE__,
    operation: "room:update:reply"

  @primary_key false
  schema "rooms" do
    field(:name, :string)
    field(:description, :string)
    field(:isPrivate, :boolean)
    field(:autoSpeaker, :boolean)
  end

  def initialize(state) do
    if room = Beef.Rooms.get_room_by_creator_id(state.user_id) do
      struct(__MODULE__, Map.from_struct(room))
    end
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, ~w(description isPrivate name autoSpeaker)a)
    |> validate_required([:name])
  end

  def execute(xxx, state) do
    raise "ZZZ"
  end

  # a bit hacky -- will need to refactor using proper db changesets in
  # the future.
  def valid?({_, nil}), do: false
  def valid?({_, ""}), do: false
  def valid?(_), do: true
end
