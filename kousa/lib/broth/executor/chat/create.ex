defimpl Broth.Executor, for: Broth.Message.Chat.SendMsg do
  def execute(%{tokens: tokens, whispered_to: whispered_to}, state) do

    Kousa.RoomChat.send_msg(
      state.user_id,
      tokens,
      whispered_to)

    {:ok, state}
  end
end
