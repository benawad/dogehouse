defimpl Broth.Executor, for: Broth.Message.Room.Leave do

  alias Broth.Message.Room.Leave.Reply
  def execute(_, state) do
    case Kousa.Room.leave_room(state.user_id) do
      {:ok, d} ->
        {:reply, %Reply{}, state}

      _ ->
        {:ok, state}
    end
  end
end
