defmodule Kousa.BL.Notification do
  alias Beef.Notifications

  def followed(user_you_want_to_follow_id, follower_id) do
    case Notifications.insert(%{type: "follow", user_id: user_you_want_to_follow_id, notifier_id: follower_id}) do
      {:ok, notification} ->
        IO.inspect notification.notifier
        broadcast_notification(user_you_want_to_follow_id, %{notification | notifier: notification.notifier})
    end
  end

  def broadcast_notification(user_id, data) do
    Kousa.Gen.UserSession.send_cast(user_id, {:send_ws_msg, :web, %{op: "new_notification", d: data }})
  end

end
