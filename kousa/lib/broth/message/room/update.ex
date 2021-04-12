defmodule Broth.Message.Room.Update do
  use Broth.Message.Call,
    reply: __MODULE__,
    operation: "room:update:reply"

  @primary_key false
  schema "rooms" do
    field :name, :string
  end

  def room_changeset(changeset, data) do
    cast(changeset, data, ~w(description isPrivate name autoSpeaker)a)
  end

  def execute(%{room: room}, state) do
    update = room |> IO.inspect(label: "6")
    |> Map.take([:name, :isPrivate, :description])
    |> Enum.filter(&valid?/1) # must not have nil values
    |> Map.new()

    # TODO: make this a proper changeset-mediated alteration.
    case Kousa.Room.update(state.user_id, update) do
      {:error, changeset} ->
        raise "foobar"
      {:ok, room} ->
        raise "foo"
        #{:reply, %__MODULE__{name: room}, state}
    end
  end

  # a bit hacky -- will need to refactor using proper db changesets in
  # the future.
  def valid?({_, nil}), do: false
  def valid?({_, ""}), do: false
  def valid?(_), do: true
end
