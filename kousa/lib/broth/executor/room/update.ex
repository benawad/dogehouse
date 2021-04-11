defimpl Broth.Executor, for: Broth.Message.Room.Update do

  alias Broth.Message.Room.Update.Reply

  def execute(%{room: room}, state) do
    update = room |> IO.inspect(label: "6")
    |> Map.take([:name, :isPrivate, :description])
    |> Enum.filter(&valid?/1) # must not have nil values
    |> Map.new()
    |> IO.inspect(label: "10")

    # TODO: make this a proper changeset-mediated alteration.
    case Kousa.Room.update(state.user_id, update) do
      {:error, changeset} ->
        error = Ecto.Changeset.traverse_errors(changeset, &inspect/1)
        {:ok, %Reply{error: error}}
      {:ok, room} ->
        {:reply, %Reply{room: room}, state}
    end
  end

  # a bit hacky -- will need to refactor using proper db changesets in
  # the future.
  def valid?({_, nil}), do: false
  def valid?({_, ""}), do: false
  def valid?(_), do: true
end
