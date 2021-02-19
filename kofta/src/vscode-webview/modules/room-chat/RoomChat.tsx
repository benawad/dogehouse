import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { tw } from "twind";
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
        flex: 1,
        display: "flex",
        width: sidebar ? 340 : "100%",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: sidebar ? 340 : "100%",
          height: sidebar ? "100%" : undefined,
          flex: 1,
        }}
        className={tw`flex flex-col ${sidebar ? `fixed bottom-0` : ``}`}
      >
        <button
          style={{ borderBottom: "1px solid #808080", height: 72 }}
          onClick={() => toggleOpen()}
          className={tw`bg-tmpBg1 text-tmpC3 py-4 px-8 text-2xl flex items-center`}
        >
          Chat <span className={tw`ml-2 text-tmpC1`}>[emotes soon]</span>
        </button>
        <RoomChatList />
        <RoomChatMentions />
        <RoomChatInput />
      </div>
    </div>
  );
};
