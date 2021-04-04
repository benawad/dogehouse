import { Room, RoomUser } from "@dogehouse/kebab";
import React, { useEffect } from "react";
import { useCurrentRoomIdStore } from "../../../global-stores/useCurrentRoomIdStore";
import { useTypeSafeTranslation } from "../../../shared-hooks/useTypeSafeTranslation";
import { RoomChatInput } from "./RoomChatInput";
import { RoomChatList } from "./RoomChatList";
import { RoomChatMentions } from "./RoomChatMentions";
import { useRoomChatStore } from "./useRoomChatStore";

interface ChatProps {
  room: Room;
  users: RoomUser[];
}

export const RoomChat: React.FC<ChatProps> = ({ users, room }) => {
  const { currentRoomId } = useCurrentRoomIdStore();

  const [open, reset, toggleOpen] = useRoomChatStore((s) => [
    s.open,
    s.reset,
    s.toggleOpen,
  ]);

  const { t } = useTypeSafeTranslation();

  useEffect(() => {
    if (!currentRoomId) {
      reset();
    }
  }, [reset, currentRoomId]);
  if (!open) {
    return null;
  }
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
