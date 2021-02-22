import React from "react";
import { wsend } from "../../createWebsocket";
import { CurrentRoom, BaseUser, RoomUser } from "../types";
import { UserNode } from "./UserNode";

interface RoomUserNodeProps {
  u: RoomUser;
  me?: BaseUser | null;
  profile?: BaseUser | null;
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
  const isSpeaker = !!u.roomPermissions?.isSpeaker;
  const canSpeak = isCreator || isSpeaker;
  const isMuted = me?.id === u.id ? muted : room.muteMap[u.id];

  return (
    <UserNode
      u={u}
      isMuted={canSpeak && isMuted}
      isCreator={isCreator}
      isSpeaking={
        canSpeak && u.id in room.activeSpeakerMap && !room.muteMap[u.id]
      }
      isMod={!!u.roomPermissions?.isMod}
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
