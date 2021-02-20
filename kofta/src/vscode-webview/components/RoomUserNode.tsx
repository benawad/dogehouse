import React from "react";
import { wsend } from "feta/createWebsocket";
import { CurrentRoom, User } from "feta/types";
import { UserNode } from "./UserNode";

interface RoomUserNodeProps {
  u: User;
  me?: User | null;
  profile?: User | null;
  room: CurrentRoom;
  setUserProfileId: (s: string) => void;
  muted: boolean;
}

export const RoomUserNode: React.FC<RoomUserNodeProps> = ({
  u,
  room,
  me,
  profile,
  muted,
  setUserProfileId,
}) => {
  const isCreator = u.id === room.creatorId;
  const isSpeaker = u.canSpeakForRoomId === room.id;
  const canSpeak = isCreator || isSpeaker;
  const isMuted = me?.id === u.id ? muted : room.muteMap[u.id];
  return (
    <UserNode
      u={u}
      isMuted={canSpeak && isMuted}
      isCreator={isCreator}
      isSpeaking={isSpeaker && u.id in room.activeSpeakerMap}
      isMod={u.modForRoomId === room.id}
      isSpeaker={isSpeaker}
      onClick={() => {
        if (u.id === profile?.id) {
          setUserProfileId("");
        } else {
          if (
            (u.youAreFollowing === undefined || u.youAreFollowing === null) &&
            me?.id !== u.id
          ) {
            wsend({ op: "follow_info", d: { userId: u.id } });
          }
          setUserProfileId(u.id);
        }
      }}
    />
  );
};
