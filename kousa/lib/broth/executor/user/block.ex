defimpl Broth.Executor, for: Broth.Message.User.Block do

  alias Broth.Message.User.Block.Reply

  def execute(%{userId: user_id}, state) do
    case Kousa.UserBlock.block(state.user_id, user_id) do
      {:ok, %{userIdBlocked: blocked}} ->
        # TODO: update this to return a full user update.
        {:reply, %Reply{blocked: [blocked]}, state}
      {:error, _error} ->
        {:reply, %Reply{error: "error blocking #{user_id}"}, state}
    end
  end
end
