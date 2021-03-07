import { wsend } from "./../../createWebsocket";
import { toast } from "react-toastify";
import { Notification } from "./../modules/notifications/useNotificationStore";

export const showNotificationToast = (notification: Notification, t: any) => {
	switch (notification.type) {
		case "follow":
			toast(
				"🔔 " +
					t("notifications.messages.follow", {
						notifier: notification.notifier.displayName,
					}),
				{
					type: "info",
					onClose: () =>
						wsend({ op: "set_notification_read", d: { id: notification.id } }),
				}
			);
			break;
	}
};
