defimpl Broth.Executor, for: Broth.Message.User.Update do

  alias Broth.Message.User.Update.Reply

  def execute(req = %{user: user}, state) do
    # TODO: make this a proper changeset-mediated alteration.
    case Kousa.User.edit_profile(
      state.user_id,
      Map.take(user, [:muted, :username])) do
      {:error, changeset} ->
        error = Ecto.Changeset.traverse_errors(changeset, fn
          {error, string} -> "#{error}: #{string}"
        end)
        {:ok, %Reply{
          # TODO: have this return the current user state.
          user: nil,
          error: error,
          isUsernameTaken: error =~ "has already been taken"
        }}
      {:ok, user} ->
        {:reply, %Reply{
          user: user,
          isUsernameTaken: false
        }, state}
    end
  end
end
