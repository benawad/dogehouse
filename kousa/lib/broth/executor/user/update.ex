defimpl Broth.Executor, for: Broth.Message.User.Update do
  def execute(data, state) do
    # TODO: make this a proper changeset-mediated alteration.
    case Kousa.User.update(state.user_id, Map.from_struct(data)) do
      {:error, changeset} ->
        # TODO: make this better:
        error = Kousa.Utils.Errors.changeset_to_first_err_message(changeset)
        {:reply, %{error: error}, state}
      {:ok, user} ->
        {:reply, Map.from_struct(user), state}
    end
  end
end
