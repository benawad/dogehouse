defmodule Kousa.BL.User do
  alias Kousa.Gen
  alias Kousa.RegUtils
  alias Beef.Users
  alias Kousa.Gen
  alias Kousa.RegUtils
  alias Kousa.BL

  def delete(user_id) do
    BL.Room.leave_room(user_id)
    Users.delete(user_id)
  end

  def edit_profile(user_id, data) do
    case Users.edit_profile(user_id, data) do
      {:error, %Ecto.Changeset{errors: [{_, {"has already been taken", _}}]}} ->
        :username_taken

      {:ok, %{displayName: displayName}} ->
        RegUtils.lookup_and_cast(Gen.UserSession, user_id, {:set, :display_name, displayName})
        :ok

      _ ->
        :ok
    end
  end

  def ban(user_id, username_to_ban, reason_for_ban) do
    user = Users.get_by_id(user_id)

    if user.githubId == Application.get_env(:kousa, :ben_github_id, "") do
      user_to_ban = Users.get_by_username(username_to_ban)

      if not is_nil(user_to_ban) do
        Kousa.BL.Room.leave_room(user_to_ban.id, user_to_ban.currentRoomId)
        Users.set_reason_for_ban(user_to_ban.id, reason_for_ban)

        Kousa.Gen.UserSession.send_cast(
          user_to_ban.id,
          {:send_ws_msg, :web, %{op: "banned", d: %{}}}
        )

        true
      else
        IO.puts("tried to ban " <> username_to_ban <> " but that username didn't exist")
        false
      end
    else
      false
    end
  end
end
