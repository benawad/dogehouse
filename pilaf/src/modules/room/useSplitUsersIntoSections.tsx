import {
  BaseUser,
  JoinRoomAndGetInfoResponse,
  Room,
  RoomUser,
} from "@dogehouse/kebab";
import React, { useContext } from "react";
import { RoomAvatar } from "../../components/avatars/RoomAvatar";
import { SingleUserAvatar } from "../../components/avatars/SingleUserAvatar";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useConn } from "../../shared-hooks/useConn";

export const useSplitUsersIntoSections = ({
  room,
  users,
  activeSpeakerMap,
  muteMap,
}: JoinRoomAndGetInfoResponse) => {
  const conn = useConn();
  const { muted } = useMuteStore();
  const speakers: React.ReactNode[] = [];
  const askingToSpeak: React.ReactNode[] = [];
  const listeners: React.ReactNode[] = [];
  let canIAskToSpeak = false;

  users.forEach((u) => {
    let arr = listeners;
    if (u.id === room.creatorId || u.roomPermissions?.isSpeaker) {
      arr = speakers;
    } else if (u.roomPermissions?.askedToSpeak) {
      arr = askingToSpeak;
    } else {
      canIAskToSpeak = true;
    }

    let flair: React.ReactNode | undefined = undefined;

    const isCreator = u.id === room.creatorId;
    const isSpeaker = !!u.roomPermissions?.isSpeaker;
    const canSpeak = isCreator || isSpeaker;
    const isMuted = conn.user.id === u.id ? muted : muteMap[u.id];

    // for (let i = 0; i < 50; i++) {
    arr.push(
      <RoomAvatar
        key={u.id}
        src={{ uri: u.avatarUrl }}
        muted={isMuted}
        username={u.displayName}
        style={{ marginRight: 10, marginBottom: 10 }}
      />
    );
    // }
  });

  return { speakers, listeners, askingToSpeak, canIAskToSpeak };
};
