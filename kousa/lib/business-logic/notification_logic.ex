defmodule Kousa.BL.Notification do
  alias Beef.Notifications

  def followed(user_you_want_to_follow_id, follower_id) do
    notification = Notifications.insert(%{type: "follow", user_id: user_you_want_to_follow_id, notifier_id: follower_id})
    broadcast_notification(user_you_want_to_follow_id, notification)
  end

  def broadcast_notification(user_id, data) do
    Kousa.RegUtils.lookup_and_cast(Kousa.Gen.UserSession, user_id, {:send_ws_msg, :web, data})
  end

end
