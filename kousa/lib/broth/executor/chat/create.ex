defimpl Broth.Executor, for: Broth.Message.Chat.SendMsg do
  def execute(%{tokens: tokens, whisperedTo: whisperedTo}, state) do

    Kousa.RoomChat.send_msg(
      state.user_id,
      tokens,
      whisperedTo)

    {:ok, state}
  end
end
