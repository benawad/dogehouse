defimpl Broth.Executor, for: Broth.Message.Room.Create do
  def execute(%{room: request}, state) do
    request |> IO.inspect(label: "3")
    state |> IO.inspect(label: "4")
    case Kousa.Room.create_room(
      state.user_id,
      request.name,
      request.description,
      request.isPrivate,
      nil
    ) |> IO.inspect(label: "9") do
      {:ok, d} -> d |> IO.inspect(label: "10")
      {:reply, d, state}
      # more meaningful errors?
      {:error, _} -> {:ok, state}
    end
  end
end
