defmodule Kousa.BL.Notification do
  alias Beef.Notifications

  def followed(user_you_want_to_follow_id, follower_id) do
    Notifications.insert(%{type: "follow", user_id: user_you_want_to_follow_id, notifier_id: follower_id})
    Kousa.RegUtils.lookup_and_cast(Kousa.Gen.UserSession, user_you_want_to_follow_id)
  end

end
