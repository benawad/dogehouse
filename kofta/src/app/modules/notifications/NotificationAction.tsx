import React from "react";
import { wsend } from "../../../createWebsocket";
import { Button } from "../../components/Button";
import { Notification } from "./useNotificationStore";

interface NotificationActionProps {
	notification: Notification;
}

export const NotificationAction: React.FC<NotificationActionProps> = ({
	notification,
}) => {
	switch (notification.type) {
		case "follow":
			return !notification.notifier.youAreFollowing ? (
				<Button
					variant="small"
					onClick={() => {
						wsend({
							op: "follow",
							d: {
								userId: notification.notifier.id,
								value: true,
							},
						});
					}}
				>
					follow back
				</Button>
			) : null;

		default:
			return <></>;
	}
};
