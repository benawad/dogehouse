import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import { useNavigation } from "@react-navigation/core";
import React, { useContext } from "react";
import { RoomAvatar } from "../../components/avatars/RoomAvatar";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useConn } from "../../shared-hooks/useConn";
import { UserPreviewModalContext } from "./UserPreviewModalProvider";

export const useSplitUsersIntoSections = ({
  room,
  users,
  activeSpeakerMap,
  muteMap,
}: JoinRoomAndGetInfoResponse) => {
  const conn = useConn();
  const { muted } = useMuteStore();
  const { setData } = useContext(UserPreviewModalContext);
  const navigation = useNavigation();
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

    const isCreator = u.id === room.creatorId;
    const isSpeaker = !!u.roomPermissions?.isSpeaker;
    const canSpeak = isCreator || isSpeaker;
    const isMuted = conn.user.id === u.id ? muted : muteMap[u.id];

    arr.push(
      <RoomAvatar
        key={u.id}
        src={{ uri: u.avatarUrl }}
        muted={canSpeak && isMuted}
        username={u.displayName}
        style={{ marginRight: 5, marginBottom: 10, flexBasis: "23%" }}
        activeSpeaker={canSpeak && !isMuted && u.id in activeSpeakerMap}
        onPress={() => {
          setData({ userId: u.id });
          navigation.navigate("RoomUserPreview", { userId: u.id });
        }}
      />
    );
  });

  return { speakers, listeners, askingToSpeak, canIAskToSpeak };
};
