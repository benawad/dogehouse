import isElectron from "is-electron";
import { useContext } from "react";
import { WebSocketContext } from "../modules/ws/WebSocketProvider";
import { useCurrentRoomFromCache } from "./useCurrentRoomFromCache";

let roomModData: { [id: string]: boolean } = {};
let ipcRenderer: any = undefined;

export const useCurrentRoomInfo = () => {
  const data = useCurrentRoomFromCache();
  const { conn } = useContext(WebSocketContext);

  if (!data || !conn || "error" in data) {
    return {
      isMod: false,
      isCreator: false,
      isSpeaker: false,
      canSpeak: false,
    };
  }

  let isMod = false;
  let isSpeaker = false;
  let canIAskToSpeak = false;
  const me = conn.user;
  const isCreator = me.id === data.room.creatorId;

  const { users } = data;

  for (const u of users) {
    if (u.id === me.id) {
      if (u.roomPermissions?.isSpeaker) {
        isSpeaker = true;
      }
      if (u.roomPermissions?.isMod) {
        isMod = true;
      }
      canIAskToSpeak =
        !u.roomPermissions?.askedToSpeak && !isCreator && !isSpeaker;
      break;
    }
  }

  if (isElectron()) {
    const currentRoomId = data.room.id;
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
    canIAskToSpeak,
    canSpeak: isCreator || isSpeaker,
  };
};
