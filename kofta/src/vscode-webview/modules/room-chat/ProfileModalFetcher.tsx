import { useAtom } from "jotai";
import React, { useEffect, useLayoutEffect } from "react";
import { wsend } from "../../../createWebsocket";
import { useCurrentRoomStore } from "../../../webrtc/stores/useCurrentRoomStore";
import { meAtom, useCurrentRoomInfo, userProfileAtom } from "../../atoms";
import { ProfileModal } from "../../components/ProfileModal";
import { RoomUser } from "../../types";
import { RoomChatMessage } from "./useRoomChatStore";

interface ProfileModalFetcherProps {
	userId: string;
	userIdType?: "uuid" | "username";
	onClose: () => void;
	messageToBeDeleted?: RoomChatMessage | null;
}

export const ProfileModalFetcher: React.FC<ProfileModalFetcherProps> = ({
	userId,
	userIdType = "uuid",
	onClose,
	messageToBeDeleted,
}) => {
	const { currentRoom: room } = useCurrentRoomStore();
	const [me] = useAtom(meAtom);
	const [userProfile] = useAtom(userProfileAtom);
	const { isMod: iAmMod, isCreator: iAmCreator } = useCurrentRoomInfo();

	const profileFromRoom: RoomUser | undefined = room?.users.find((x) =>
		[x.id, x.username].includes(userId)
	);

	const profile = profileFromRoom || userProfile;

	useEffect(() => {
		profileFromRoom ||
			wsend({ op: "get_user_profile", d: { userId, userIdType } });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId]);

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
