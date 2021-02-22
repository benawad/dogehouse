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
    <div
      style={{
        width: sidebar ? 340 : "100%",
      }}
      className={`flex flex-1 w-full overflow-y-auto`}
    >
      <div
        style={{
          width: sidebar ? 340 : "100%",
          height: sidebar ? "100%" : undefined,
        }}
        className={`flex flex-1 w-full flex-col ${sidebar ? `fixed bottom-0` : ``}`}
      >
        <button
          style={{ borderBottom: "1px solid #808080", height: 72 }}
          onClick={() => toggleOpen()}
          className={`bg-gray-800 border-b border-gray-400 text-gray-50 py-4 px-8 text-2xl flex items-center h-20`}
        >
          Chat <span className={`ml-2 text-gray-400`}>[emotes soon]</span>
        </button>
        <RoomChatList />
        <RoomChatMentions />
        <RoomChatInput />
      </div>
    </div>
  );
};
