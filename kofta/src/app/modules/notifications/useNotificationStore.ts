import { BaseUser } from "./../../types";
import create from "zustand";
import { combine } from "zustand/middleware";

export type Notification = {
	type: "follow";
	notifier: BaseUser;
	inserted_at: string;
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
		})
	)
);
