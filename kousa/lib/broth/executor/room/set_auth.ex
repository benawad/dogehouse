defimpl Broth.Executor, for: Broth.Message.Room.SetAuth do
  def execute(%{userId: user_id, level: level}, state) do
    Kousa.Room.set_auth(user_id, level, by: state.user_id)
    {:ok, state}
  end
end
