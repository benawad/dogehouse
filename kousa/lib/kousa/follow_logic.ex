defmodule Kousa.Follow do
  alias Beef.Follows
  alias Beef.Users
  alias Beef.UserBlocks
  alias Beef.Schemas.Follow
  alias Beef.Schemas.Room

  def get_follow_list(user_id, user_id_to_get_list_for, get_following_list, cursor) do
    if get_following_list do
      Follows.get_following(user_id, user_id_to_get_list_for, cursor)
    else
      Follows.get_followers(user_id, user_id_to_get_list_for, cursor)
    end
  end

  # probably can be refactored into a single db query
  def get_follow_list_by_username(user_id, username, get_following_list, cursor) do
    user = Users.get_by_username(username)

    case user do
      %{id: id} ->
        if get_following_list do
          Follows.get_following(user_id, id, cursor)
        else
          Follows.get_followers(user_id, id, cursor)
        end

      _ ->
        %{users: [], nextCursor: nil}
    end
  end

  # TODO: break this out into assertive "follow" and "unfollow" commands, instead of
  # ambiguous "should_follow"
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
        Onion.UserSession.send_ws(followerId, nil, %{
          op: "someone_you_follow_created_a_room",
          d: %{
            roomId: room.id,
            roomName: room.name,
            displayName: user.displayName,
            username: user.username,
            avatarUrl: user.avatarUrl,
            # Here if banner will be included in the refactored someone you followed created a room popup
            bannerUrl: user.bannerUrl,
            type: "someone_you_follow_created_a_room"
          }
        })
      end)
    end

    {:ok}
  end

  @spec notify_followers_you_created_a_room(String.t(), Room.t()) :: {:ok, pid()}
  def notify_followers_you_created_a_room(user_id, room) do
    Task.start(fn -> sync_notify_followers_you_created_a_room(user_id, room) end)
  end
end
