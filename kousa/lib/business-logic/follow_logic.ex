defmodule Kousa.BL.Follow do
  alias Kousa.{Data, Gen}

  def get_follow_list(user_id, user_id_to_get_list_for, get_following_list, cursor) do
    if get_following_list do
      Data.Follower.get_following(user_id, user_id_to_get_list_for, cursor)
    else
      Data.Follower.get_followers(user_id, user_id_to_get_list_for, cursor)
    end
  end

  def follow(user_id, user_you_want_to_follow_id, should_follow) do
    if should_follow do
      if user_id != user_you_want_to_follow_id and
           not Data.UserBlock.is_blocked(user_you_want_to_follow_id, user_id) do
        Data.Follower.insert(%{userId: user_you_want_to_follow_id, followerId: user_id})
      end
    else
      Data.Follower.delete(
        user_you_want_to_follow_id,
        user_id
      )
    end
  end

  @spec sync_notify_followers_you_created_a_room(String.t(), Beef.Room.t()) :: {:ok}
  def sync_notify_followers_you_created_a_room(user_id, room) do
    followers_to_notify = Data.Follower.get_followers_online_and_not_in_a_room(user_id)

    if length(followers_to_notify) > 0 do
      user = Data.User.get_by_id(user_id)

      Enum.each(followers_to_notify, fn %Beef.Follow{followerId: followerId} ->
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

  @spec notify_followers_you_created_a_room(String.t(), Beef.Room.t()) :: {:ok, pid()}
  def notify_followers_you_created_a_room(user_id, room) do
    Task.start(fn -> sync_notify_followers_you_created_a_room(user_id, room) end)
  end
end
