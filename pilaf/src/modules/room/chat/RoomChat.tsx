import { Room, RoomUser } from "@dogehouse/kebab";
import React, { useEffect } from "react";
import { useCurrentRoomIdStore } from "../../../global-stores/useCurrentRoomIdStore";
import { RoomChatInput } from "./RoomChatInput";
import { RoomChatList } from "./RoomChatList";
import { RoomChatMentions } from "./RoomChatMentions";
import { useRoomChatStore } from "./useRoomChatStore";
import { View, ViewStyle } from "react-native";

interface ChatProps {
  room: Room;
  users: RoomUser[];
  style: ViewStyle;
}

export const RoomChat: React.FC<ChatProps> = ({ users, room, style }) => {
  const { currentRoomId } = useCurrentRoomIdStore();

  const [open, reset, toggleOpen] = useRoomChatStore((s) => [
    s.open,
    s.reset,
    s.toggleOpen,
  ]);

  useEffect(() => {
    if (!currentRoomId) {
      reset();
    }
  }, [reset, currentRoomId]);
  if (!open) {
    return null;
  }
  return (
    <View style={style}>
      <RoomChatList room={room} />
      {/* <RoomChatMentions users={users} />
      <RoomChatInput users={users} /> */}
    </View>
  );
};
