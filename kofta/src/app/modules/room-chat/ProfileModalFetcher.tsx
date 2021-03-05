import { useAtom } from "jotai";
import React, { useLayoutEffect } from "react";
import { wsend } from "../../../createWebsocket";
import { useCurrentRoomStore } from "../../../webrtc/stores/useCurrentRoomStore";
import { meAtom, useCurrentRoomInfo } from "../../atoms";
import { ProfileModal } from "../../components/ProfileModal";
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
  const [me] = useAtom(meAtom);
  const { isMod: iAmMod, isCreator: iAmCreator } = useCurrentRoomInfo();
  const profile = room?.users.find((x) => [x.id, x.username].includes(userId));

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
