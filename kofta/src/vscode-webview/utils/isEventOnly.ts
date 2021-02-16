import { RoomChatMessage } from "./../modules/room-chat/useRoomChatStore";
export const isEventOnly = (m: RoomChatMessage) => {
  return !!m.tokens.filter(t => t.t === "event").length;
};
