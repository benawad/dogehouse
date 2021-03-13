import { UserWithFollowInfo } from "./../../types";
import create from "zustand";
import { combine } from "zustand/middleware";

export type NotificationType = "follow";

export type Notification = {
	id: string;
	type: NotificationType;
	notifier: UserWithFollowInfo;
	inserted_at: string;
	is_read: boolean;
};

export const useNotificationStore = create(
	combine(
		{
			notifications: [] as Notification[],
			newNotification: false as boolean,
		},
		(set) => ({
			setNotifications: (notifications: Notification[]) =>
				set({ notifications }),
			addNotification: (notification: Notification) =>
				set((s) => ({
					...s,
					newNotification: true,
					notifications: [notification].concat(s.notifications),
				})),
			setRead: (id: string) =>
				set((s) => ({
					...s,
					notifications: s.notifications.map((n) => ({
						...n,
						is_read: n.id === id ? true : n.is_read,
					})),
				})),
		})
	)
);
