import { wsend } from "./../../createWebsocket";
import { toast } from "react-toastify";
import {
	Notification,
	NotificationType,
} from "./../modules/notifications/useNotificationStore";

export const notificationTranslationKey = (type: NotificationType) => {
	return type === "follow"
		? "notifications.messages.follow"
		: "notifications.messages.follow";
};

export const showNotificationToast = (notification: Notification, t: any) => {
	switch (notification.type) {
		case "follow":
			toast(
				"🔔 " +
					t(notificationTranslationKey(notification.type), {
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
