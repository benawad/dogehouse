defimpl Broth.Executor, for: Broth.Message.User.Ban do

  alias Broth.Message.User.Ban.Reply

  def execute(%{userId: user_id, reason: reason}, state) do
    reply = case Kousa.User.ban(user_id, reason, admin_id: state.user_id) do
      :ok -> %Reply{worked: true}
      {:error, msg} -> %Reply{error: msg, worked: false}
    end

    {:reply, reply, state}
  end
end
