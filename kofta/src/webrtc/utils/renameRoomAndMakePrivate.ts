import { wsend } from "../../createWebsocket";

export const renameRoomAndMakePrivate = (currentName: string) => {
  const roomName = window.prompt("Set private room name", currentName);
  if (roomName) {
    wsend({ op: "make_room_private", d: { newName: roomName } });
  }
};
