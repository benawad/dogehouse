import isElectron from "is-electron";
import { useContext } from "react";
import { useCurrentRoomIdStore } from "../global-stores/useCurrentRoomIdStore";
import { isServer } from "../lib/isServer";
import { WebSocketContext } from "../modules/ws/WebSocketProvider";
import { useTypeSafeQuery } from "./useTypeSafeQuery";

let roomModData: { [id: string]: boolean; } = {};
let ipcRenderer: any = undefined;

export const useCurrentRoomInfo = () => {
  const { currentRoomId } = useCurrentRoomIdStore();
  const { data } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", currentRoomId || ""],
    {
      enabled: !!currentRoomId && !isServer,
    },
    [currentRoomId || ""]
  );
  const { conn } = useContext(WebSocketContext);

  if (!data || !conn || !currentRoomId || "error" in data) {
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

  const isCreator = me.id === data.room.creatorId;
  if (isElectron()) {
    if (!roomModData) {
      roomModData = { [currentRoomId]: false };
    }
    if (!roomModData[currentRoomId]) {
      roomModData[currentRoomId] = false;
    }
    if (roomModData[currentRoomId] !== isMod) {
      roomModData[currentRoomId] = isMod;
      ipcRenderer = window.require("electron").ipcRenderer;
      ipcRenderer.send("@notification/mod", isMod);
    }
  }
  return {
    isCreator,
    isMod,
    isSpeaker,
    canSpeak: isCreator || isSpeaker,
  };
};
