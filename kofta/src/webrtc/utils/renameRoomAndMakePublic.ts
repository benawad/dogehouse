import { wsend } from "../../createWebsocket";

export const renameRoomAndMakePublic = (currentName: string) => {
  const roomName = window.prompt("Set public room name", currentName);
  if (roomName) {
    wsend({ op: "make_room_public", d: { newName: roomName } });
  }
};
