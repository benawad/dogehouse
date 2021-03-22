import { useContext } from "react";
import { useCurrentRoomStore } from "../global-stores/useCurrentRoomStore";
import { WebSocketContext } from "../modules/ws/WebSocketProvider";
import { useTypeSafeQuery } from "./useTypeSafeQuery";

export const useCurrentRoomInfo = () => {
  const { currentRoom } = useCurrentRoomStore();
  const { data } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", currentRoom?.id || ""],
    {
      enabled: !!currentRoom,
    }
  );
  const { conn } = useContext(WebSocketContext);

  if (!data || !conn || !currentRoom || "error" in data) {
    return {
      isMod: false,
      isCreator: false,
      isSpeaker: false,
      canSpeak: false,
    };
  }

  let isMod = false;
  let isSpeaker = false;

  const { users } = data;
  const me = conn.user;

  for (const u of users) {
    if (u.id === me.id) {
      if (u.roomPermissions?.isSpeaker) {
        isSpeaker = true;
      }
      if (u.roomPermissions?.isMod) {
        isMod = true;
      }
      break;
    }
  }

  const isCreator = me.id === currentRoom.creatorId;

  return {
    isCreator,
    isMod,
    isSpeaker,
    canSpeak: isCreator || isSpeaker,
  };
};
