import { showInfoToast } from './showToast';
import { Notification } from './../modules/notifications/useNotificationStore';


export const showNotificationToast = (notification: Notification, t: any) => {
  console.log(notification.notifier);
  
  switch (notification.type) {
    case "follow":
      showInfoToast("🔔 " + t("notifications.messages.follow", { notifier: notification.notifier.displayName }))
      break;
  }
  
}