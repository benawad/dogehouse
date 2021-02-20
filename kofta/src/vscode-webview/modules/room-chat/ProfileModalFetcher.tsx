import { useAtom } from "jotai";
import React, { useLayoutEffect } from "react";
import { wsend } from "../../../createWebsocket";
import { currentRoomAtom, meAtom, myCurrentRoomInfoAtom } from "../../atoms";
import { ProfileModal } from "../../components/ProfileModal";

interface ProfileModalFetcherProps {
  userId: string;
  onClose: () => void;
}

export const ProfileModalFetcher: React.FC<ProfileModalFetcherProps> = ({
  userId,
  onClose,
}) => {
  const [room] = useAtom(currentRoomAtom);
  const [me] = useAtom(meAtom);
  const [{ isMod: iAmMod, isCreator: iAmCreator }] = useAtom(
    myCurrentRoomInfoAtom,
  );
  const profile = room?.users.find(x => [x.id, x.username].includes(userId));

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
    />
  );
};
