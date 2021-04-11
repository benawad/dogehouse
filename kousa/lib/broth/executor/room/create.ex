defimpl Broth.Executor, for: Broth.Message.Room.Create do

  alias Broth.Message.Room.Create.Reply
  def execute(%{room: request}, state) do
    case Kousa.Room.create_room(
      state.user_id,
      request.name,
      request.description,
      request.isPrivate,
      nil
    ) do
      {:ok, %{room: room}} ->
        {:reply, %Reply{room: room}, state}
      # more meaningful errors?
      {:error, _} -> {:ok, state}
    end
  end
end
