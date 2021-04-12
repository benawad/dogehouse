defmodule Kousa.User do
  alias Beef.Users

  def delete(user_id) do
    Kousa.Room.leave_room(user_id)
    Users.delete(user_id)
  end

  def update(user_id, data) do
    case Users.edit_profile(user_id, data) do
      {:ok, user} ->
        Onion.UserSession.set_state(
          user_id,
          %{
            display_name: user.displayName,
            username: user.username,
            avatar_url: user.avatarUrl
          }
        )
        {:ok, user}
      error -> error
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
end
