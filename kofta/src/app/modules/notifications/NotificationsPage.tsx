import React, { useState } from "react";
import { useQuery } from "react-query";
import { wsFetch } from "../../../createWebsocket";
import { useSocketStatus } from "../../../webrtc/stores/useSocketStatus";
import { Backbar } from "../../components/Backbar";
import { BodyWrapper } from "../../components/BodyWrapper";
import { BottomVoiceControl } from "../../components/BottomVoiceControl";
import { ProfileButton } from "../../components/ProfileButton";
import { Spinner } from "../../components/Spinner";
import { Wrapper } from "../../components/Wrapper";
import { Notifications } from "../../types";
import { useTypeSafeTranslation } from "../../utils/useTypeSafeTranslation";
import { NotificationCard } from "./NotificationCard";

interface NotificationsPageProps {}

export const GET_NOTIFICATIONS = "get_notifications";

const Page = ({
	onLoadMore,
	cursor,
	isLastPage,
	isOnlyPage,
}: {
	cursor: number;
	isLastPage: boolean;
	isOnlyPage: boolean;
	onLoadMore: (o: number) => void;
}) => {
	const { status } = useSocketStatus();
	const { isLoading, data } = useQuery<Notifications>(
		[GET_NOTIFICATIONS, cursor],
		() =>
			wsFetch<any>({
				op: GET_NOTIFICATIONS,
				d: { cursor },
			}),
		{ staleTime: Infinity, enabled: status === "auth-good" }
	);
	const { t } = useTypeSafeTranslation();

	if (isLoading) {
		return <Spinner />;
	}

	if (!data) {
		return null;
	}

	if (isOnlyPage && data.notifications.length === 0) {
		return <div className={`mt-8 text-xl ml-4`}>no notifications</div>;
	}

	return (
		<>
			{data.notifications.map((n, i) => (
				<NotificationCard notification={n} key={i} />
			))}
		</>
	);
};

export const NotificationsPage: React.FC<NotificationsPageProps> = ({}) => {
	const [cursors, setCursors] = useState<number[]>([0]);
	const { t } = useTypeSafeTranslation();

	return (
		<div className={`flex flex-col flex-1`}>
			<Wrapper>
				<BodyWrapper>
					<Backbar>
						<h1
							className={`font-xl flex-1 text-center flex items-center justify-center text-2xl`}
						>
							Notifications
						</h1>
						<ProfileButton />
					</Backbar>
					{cursors.map((cursor, i) => (
						<Page
							onLoadMore={(o: number) => setCursors([...cursors, o])}
							isOnlyPage={cursors.length === 1}
							isLastPage={cursors.length - 1 === i}
							key={cursor}
							cursor={cursor}
						/>
					))}
					<div style={{ height: 40 }} />
				</BodyWrapper>
			</Wrapper>
			<BottomVoiceControl />
		</div>
	);
};
