defimpl Broth.Executor, for: Broth.Message.Room.SetRole do

  alias Broth.Message.Room.Create.Reply
  def execute(%{userId: user_id, role: role}, state) do
    Kousa.Room.set_role(user_id, role, by: state.user_id)
    {:ok, state}
  end
end
