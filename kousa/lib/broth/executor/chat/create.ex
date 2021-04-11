defimpl Broth.Executor, for: Broth.Message.Chat.SendMsg do
  def execute(%{tokens: tokens, whispered_to: whispered_to}, state) do

    tokens |> IO.inspect(label: "4")
    whispered_to |> IO.inspect(label: "5")

    Kousa.RoomChat.send_msg(
      state.user_id,
      tokens,
      whispered_to)

    {:ok, state}
  end
end
