defmodule Kousa.User do
  alias Beef.Users
  alias Onion.PubSub

  def delete(user_id) do
    Kousa.Room.leave_room(user_id)
    Users.delete(user_id)
  end

  def update_with(changeset = %Ecto.Changeset{}) do
    case Users.update(changeset) do
      {:ok, user} ->
        # TODO: clean this up by making Onion.UserSession adopt the User schema and having it
        # accept pubsub broadcast messages.

        Onion.UserSession.set_state(
          user.id,
          %{
            display_name: user.displayName,
            username: user.username,
            avatar_url: user.avatarUrl,
            banner_url: user.bannerUrl
          }
        )

        PubSub.broadcast("user:update:" <> user.id, user)
        {:ok, user}

      {:error, %Ecto.Changeset{errors: [username: {"has already been taken, _"}]}} ->
        {:error, "that user name is taken"}

      error ->
        error
    end
  end

  @doc """
  bans a user from the platform.  Must be an admin operator (currently ben) to run
  this function.  Authorization passed in via the opts (:admin_id) field.

  If someone that isn't ben tries to use it, it won't leak a meaningful error message
  (to prevent side channel knowledge of authorization status)
  """
  def ban(user_id_to_ban, reason_for_ban, opts) do
    authorized_github_id = Application.get_env(:kousa, :ben_github_id, "")

    with %{githubId: ^authorized_github_id} <- Users.get_by_id(opts[:admin_id]),
         user_to_ban = %{} <- Users.get_by_id(user_id_to_ban) do
      Kousa.Room.leave_room(user_id_to_ban, user_to_ban.currentRoomId)
      Users.set_reason_for_ban(user_id_to_ban, reason_for_ban)
      Onion.UserSession.send_ws(user_id_to_ban, nil, %{op: "banned", d: %{}})
      :ok
    else
      _ -> {:error, "tried to ban #{user_id_to_ban} but that user didn't exist"}
    end
  end

  def set_staff(username_to_make_staff, value, opts) do
    authorized_github_id = Application.get_env(:kousa, :ben_github_id, "")

    with %{githubId: ^authorized_github_id} <- Users.get_by_id(opts[:admin_id]) do
      user_to_make_staff = Users.get_by_username(username_to_make_staff)
      Users.set_staff(user_to_make_staff.id, value)
      :ok
    else
      _ ->
        {:error, "tried to make #{username_to_make_staff} super admin but that user didn't exist"}
    end
  end

  def set_contributions(username_to_change_contributions, value, opts) do
    authorized_github_id = Application.get_env(:kousa, :ben_github_id, "")

    with %{githubId: ^authorized_github_id} <- Users.get_by_id(opts[:admin_id]) do
      user_to_change_contributions = Users.get_by_username(username_to_change_contributions)
      Users.set_contributions(user_to_change_contributions.id, value)
      :ok
    else
      _ ->
        {:error,
         "tried to make #{username_to_change_contributions} super admin but that user didn't exist"}
    end
  end
end
