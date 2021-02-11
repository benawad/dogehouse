defmodule Kousa.BL.Follow do
  def get_follow_list(user_id, user_id_to_get_list_for, get_following_list, cursor) do
    if get_following_list do
      Kousa.Data.Follower.get_following(user_id, user_id_to_get_list_for, cursor)
    else
      Kousa.Data.Follower.get_followers(user_id, user_id_to_get_list_for, cursor)
    end
  end

  def follow(user_id, user_you_want_to_follow_id, should_follow) do
    if should_follow do
      if user_id != user_you_want_to_follow_id and
           not Kousa.Data.UserBlock.is_blocked(user_you_want_to_follow_id, user_id) do
        Kousa.Data.Follower.insert(%{userId: user_you_want_to_follow_id, followerId: user_id})
      end
    else
      Kousa.Data.Follower.delete(
        user_you_want_to_follow_id,
        user_id
      )
    end
  end
end
