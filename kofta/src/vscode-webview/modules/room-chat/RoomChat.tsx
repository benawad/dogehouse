import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { currentRoomAtom } from "../../atoms";
import { RoomChatInput } from "./RoomChatInput";
import { RoomChatList } from "./RoomChatList";
import { RoomChatMentions } from "./RoomChatMentions";
import { useRoomChatStore } from "./useRoomChatStore";
import { useMediaQuery } from "react-responsive";

interface ChatProps {
  sidebar: boolean;
}
export const roomChatMediaQuery = "(min-width: 980px)";

export const RoomChat: React.FC<ChatProps> = ({ sidebar }) => {
  const chatShouldBeSidebar = useMediaQuery({ query: roomChatMediaQuery });
  const [room] = useAtom(currentRoomAtom);
  const [open, reset, toggleOpen] = useRoomChatStore((s) => [
    s.open,
    s.reset,
    s.toggleOpen,
  ]);

  useEffect(() => {
    if (!room) {
      reset();
    }
  }, [reset, room]);
  if (
    !open ||
    (!chatShouldBeSidebar && sidebar) ||
    (chatShouldBeSidebar && !sidebar)
  ) {
    return null;
  }
  return (
    <div className={`flex h-full flex-1 w-full overflow-y-auto chat-container`}>
      <div
        className={`bg-simple-gray-26 flex flex-1 w-full flex-col chat-room`}
      >
        <button
          onClick={() => toggleOpen()}
          className={`bg-simple-gray-26 border-b border-simple-gray-80 text-white py-4 px-8 text-2xl flex items-center h-20`}
        >
          Chat <span className={`ml-2 text-simple-gray-a6`}>[emotes soon]</span>
        </button>
        <RoomChatList />
        <RoomChatMentions />
        <RoomChatInput />
      </div>
    </div>
  );
};
