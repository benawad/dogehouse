import { RoomPermissions } from "@dogehouse/kebab";
import isElectron from "is-electron";

let ipcRenderer: any = undefined;
export const mergeRoomPermission = (
  currentRoomPermission: RoomPermissions | null | undefined,
  newRoomPermissions: Partial<RoomPermissions>
) => {
  if (newRoomPermissions.isMod) {
    if (isElectron()) {
      ipcRenderer = window.require("electron").ipcRenderer;
      ipcRenderer.send("@notification/mod", true);
    }
  }
  return {
    ...(currentRoomPermission || {
      askedToSpeak: false,
      isMod: false,
      isSpeaker: false,
    }),
    ...newRoomPermissions,
  };
};
