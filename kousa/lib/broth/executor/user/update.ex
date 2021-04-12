defimpl Broth.Executor, for: Broth.Message.User.Update do

  alias Broth.Message.User.Update

  def execute(%{user: user}, state) do
    # TODO: make this a proper changeset-mediated alteration.
    update = user
    |> Map.take([:muted, :username])
    |> Enum.filter(&elem(&1, 1)) # must not have nil values
    |> Map.new()

    #case Kousa.User.edit_profile(state.user_id, update) do
    #  {:error, changeset} ->
    #    error = Kousa.Utils.Errors.changeset_to_first_err_message(changeset)
    #    {:ok, %Update{
    #      # TODO: have this return the current user state.
    #      user: nil,
    #      error: error,
    #      isUsernameTaken: error =~ "has already been taken"
    #    }}
    #  {:ok, user} ->
    #    {:reply, %Update{
    #      user: user,
    #      isUsernameTaken: false
    #    }, state}
    #end
  end
end
