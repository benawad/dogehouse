defmodule Kousa.BL.Notification do
  alias Beef.Notifications
  alias Beef.Users

  def followed(user_you_want_to_follow_id, follower_id) do
    exists = Notifications.unread_exists?("follow", user_you_want_to_follow_id, follower_id, false)
    IO.inspect exists
    if not exists do
      case Notifications.insert(%{type: "follow", user_id: user_you_want_to_follow_id, notifier_id: follower_id}) do
        {:ok, notification} ->
          broadcast_notification(user_you_want_to_follow_id, %{type: notification.type, id: notification.id, notifier: Users.get_profile(notification.notifier_id)})
      end
    end
  end

  def set_read(user_id, notification_id) do
    Notifications.update(%{user_id: user_id, id: notification_id, is_read: true})
  end

  def broadcast_notification(user_id, data) do
    Kousa.Gen.UserSession.send_cast(user_id, {:send_ws_msg, :web, %{op: "new_notification", d: data }})
  end

end
