import { Room, RoomUser } from "@dogehouse/kebab";
import React from "react";
import { RoomChatInput } from "./RoomChatInput";
import { RoomChatList } from "./RoomChatList";
import { RoomChatMentions } from "./RoomChatMentions";

interface ChatProps {
  room: Room;
  users: RoomUser[];
}

export const RoomChat: React.FC<ChatProps> = ({ users, room }) => {
  return (
    <div
      className={`flex flex-1 w-full mb-7 overflow-y-auto bg-primary-800 h-full rounded-8`}
    >
      <div className={`flex flex-1 w-full flex-col mt-4`}>
        <RoomChatList room={room} />
        <RoomChatMentions users={users} />
        <RoomChatInput users={users} />
      </div>
    </div>
  );
};
