import { useMediaQuery } from "react-responsive";
import { roomChatMediaQuery } from "./RoomChat";
import { useRoomChatStore } from "./useRoomChatStore";

export const useShouldFullscreenChat = () => {
  const chatShouldBeSidebar = useMediaQuery({ query: roomChatMediaQuery });
  const open = useRoomChatStore((s) => s.open);

  return !chatShouldBeSidebar && open;
};
