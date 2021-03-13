import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Avatar } from "../../components/Avatar";
import { humanDuration } from "../../utils/dateFormat";
import { notificationTranslationKey } from "../../utils/notificationMessage";
import { NotificationAction } from "./NotificationAction";
import { Notification } from "./useNotificationStore";

interface NotificationCardProps {
	notification: Notification;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
	notification,
}) => {
	const { t } = useTranslation();
	const history = useHistory();

	return (
		<div
			className={`w-full my-2 flex items-center rounded py-1 px-2 ${
				notification.is_read ? "bg-simple-gray-26" : "bg-simple-gray-3a"
			}`}
		>
			<button onClick={() => history.push(`/user`, notification.notifier)}>
				<Avatar src={notification.notifier.avatarUrl} size={35} />
			</button>
			<div className="flex flex-col ml-3">
				<p className="text-md">
					{t(notificationTranslationKey(notification.type), {
						notifier: notification.notifier.displayName,
					})}
				</p>
				<small className="text-xs text-gray-400">
					{humanDuration(notification.inserted_at)}
				</small>
			</div>
			<div className="flex-1 flex justify-end">
				<div>
					<NotificationAction notification={notification} />
				</div>
			</div>
		</div>
	);
};
