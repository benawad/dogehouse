defimpl Broth.Executor, for: Broth.Message.Room.Create do
  def execute(data, state) do
    # TODO: revisit this contract.
    case Kousa.Room.create_room(
      state.user_id,
      data.name,
      data.description,
      data.isPrivate,
      data.userIdsToInvite) do
      {:ok, %{room: room}} ->
        {:reply, Map.from_struct(room), state}
      error = {:error, _} ->
        {:reply, %{error: error}}
    end
  end
end
