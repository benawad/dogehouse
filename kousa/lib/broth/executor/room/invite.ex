defimpl Broth.Executor, for: Broth.Message.Room.Invite do
  def execute(data, state) do
    Kousa.Room.invite_to_room(state.user_id, data.userId)
    {:ok, state}
  end
end
