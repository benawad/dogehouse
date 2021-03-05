defmodule Kousa.BL.Follow do
  alias Kousa.Gen
  alias Beef.Users
  alias Beef.Follows
  alias Beef.UserBlocks
  alias Beef.Schemas.User
  alias Beef.Schemas.Follow
  alias Beef.Schemas.Room

  def get_follow_list(user_id, user_id_to_get_list_for, get_following_list, cursor) do
    if get_following_list do
      Follows.get_following(user_id, user_id_to_get_list_for, cursor)
    else
      Follows.get_followers(user_id, user_id_to_get_list_for, cursor)
    end
  end

  def follow(user_id, user_you_want_to_follow_id, should_follow) do
    if should_follow do
      if user_id != user_you_want_to_follow_id and
           not UserBlocks.blocked?(user_you_want_to_follow_id, user_id) do
        Follows.insert(%{userId: user_you_want_to_follow_id, followerId: user_id})
      end
    else
      Follows.delete(
        user_you_want_to_follow_id,
        user_id
      )
    end
  end

  @spec sync_notify_followers_you_created_a_room(String.t(), Room.t()) :: {:ok}
  def sync_notify_followers_you_created_a_room(user_id, room) do
    followers_to_notify = Follows.get_followers_online_and_not_in_a_room(user_id)

    if length(followers_to_notify) > 0 do
      user = Beef.Users.get_by_id(user_id)

      Enum.each(followers_to_notify, fn %Follow{followerId: followerId} ->
        Gen.UserSession.send_cast(
          followerId,
          {:send_ws_msg, :vscode,
           %{
             op: "someone_you_follow_created_a_room",
             d: %{
               roomId: room.id,
               roomName: room.name,
               displayName: user.displayName,
               username: user.username,
               avatarUrl: user.avatarUrl,
               type: "someone_you_follow_created_a_room"
             }
           }}
        )
      end)
    end

    {:ok}
  end

  @spec notify_followers_you_created_a_room(String.t(), Room.t()) :: {:ok, pid()}
  def notify_followers_you_created_a_room(user_id, room) do
    Task.start(fn -> sync_notify_followers_you_created_a_room(user_id, room) end)
  end
end
