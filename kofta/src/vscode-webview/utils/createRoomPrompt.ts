import { wsend } from "../../createWebsocket";

export const createRoomPrompt = (value: "public" | "private") => {
  window.confirm("Would you like to make the room public?");
  const roomName = window.prompt("Room name");
  if (roomName) {
    wsend({ op: "create-room", d: { roomName, value } });
  }
};
