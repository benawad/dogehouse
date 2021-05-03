import { Room, RoomUser } from "@dogehouse/kebab";
import React, { useMemo } from "react";
import { RoomChatInput } from "./RoomChatInput";
import { RoomChatList } from "./RoomChatList";
import { RoomChatMentions } from "./RoomChatMentions";

interface ChatProps {
  room: Room;
  users: RoomUser[];
}

export const RoomChat: React.FC<ChatProps> = ({ users, room }) => {
  const userMap = useMemo(() => {
    const map: Record<string, RoomUser> = {};
    users.forEach((u) => {
      map[u.id] = u;
    });
    return map;
  }, [users]);
  return (
    <div
      className={`flex flex-1 w-full mb-7 overflow-y-auto bg-primary-800 h-full rounded-8`}
    >
      <div className={`flex flex-1 w-full flex-col mt-4`}>
        <RoomChatList room={room} userMap={userMap} />
        <RoomChatMentions users={users} />
        <RoomChatInput users={users} />
      </div>
    </div>
  );
};
