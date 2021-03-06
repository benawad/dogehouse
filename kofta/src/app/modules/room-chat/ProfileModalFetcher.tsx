import React, { useLayoutEffect } from "react";
import { useQuery } from "react-query";
import { wsend, wsFetch } from "../../../createWebsocket";
import { useCurrentRoomStore } from "../../../webrtc/stores/useCurrentRoomStore";
import { useCurrentRoomInfo } from "../../atoms";
import { ProfileModal } from "../../components/ProfileModal";
import { RoomUser, UserWithFollowInfo } from "../../types";
import { useMeQuery } from "../../utils/useMeQuery";
import { RoomChatMessage } from "./useRoomChatStore";

interface ProfileModalFetcherProps {
	userId: string;
	onClose: () => void;
	messageToBeDeleted?: RoomChatMessage | null;
}

export const ProfileModalFetcher: React.FC<ProfileModalFetcherProps> = ({
	userId,
	onClose,
	messageToBeDeleted,
}) => {
	const { currentRoom: room } = useCurrentRoomStore();
	const { me } = useMeQuery();
	const { isMod: iAmMod, isCreator: iAmCreator } = useCurrentRoomInfo();

	const profileFromRoom: RoomUser | undefined = room?.users.find((x) =>
		[x.id, x.username].includes(userId)
	);

	const { data: profileFromDB } = useQuery<UserWithFollowInfo>(
		["get_user_profile", userId],
		() =>
			wsFetch<any>({
				op: "get_user_profile",
				d: { userId },
			}),
		{ enabled: !profileFromRoom }
	);

	const profile = profileFromRoom || profileFromDB;

	useLayoutEffect(() => {
		if (
			profile &&
			me &&
			profile.id !== me.id &&
			(profile.youAreFollowing === undefined ||
				profile.youAreFollowing === null)
		) {
			wsend({ op: "follow_info", d: { userId: profile.id } });
		}
	}, [me, profile]);

	if (!room) {
		return null;
	}

	if (!profile) {
		return null;
	}
	return (
		<ProfileModal
			iAmCreator={iAmCreator}
			iAmMod={iAmMod}
			isMe={profile?.id === me?.id}
			room={room}
			onClose={onClose}
			profile={profile}
			messageToBeDeleted={messageToBeDeleted}
		/>
	);
};
