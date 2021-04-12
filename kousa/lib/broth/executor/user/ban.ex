defimpl Broth.Executor, for: Broth.Message.User.Ban do
  def execute(%{userId: user_id, reason: reason}, state) do
    reply = case Kousa.User.ban(user_id, reason, admin_id: state.user_id) do
      :ok -> %{}
      {:error, msg} -> %{error: msg}
    end

    {:reply, reply, state}
  end
end
