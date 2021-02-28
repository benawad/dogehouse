import React from "react";
import { useRoomChatStore } from "../modules/room-chat/useRoomChatStore";

export const CenterLayout: React.FC = ({ children }) => {
  const chatIsOpen = useRoomChatStore((s) => s.open);
  return (
    <div
      className={`max-w-screen-sm w-full h-full flex flex-col relative phone-simulator ${chatIsOpen ? "chat-is-open" : ""}`}
    >
      {children}
    </div>
  );
};
