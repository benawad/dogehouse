import { useContext } from "react";
import { useCurrentRoomIdStore } from "../global-stores/useCurrentRoomIdStore";
import { WebSocketContext } from "../modules/ws/WebSocketProvider";
import { useTypeSafeQuery } from "./useTypeSafeQuery";

export const useCurrentRoomInfo = () => {
  const { currentRoom } = useCurrentRoomIdStore();
  const { data } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", currentRoom?.id || ""],
    {
      enabled: !!currentRoom,
    },
    [currentRoom?.id || ""]
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
