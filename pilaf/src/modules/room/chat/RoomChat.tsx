import { Room, RoomUser } from "@dogehouse/kebab";
import React, { useEffect } from "react";
import { useCurrentRoomIdStore } from "../../../global-stores/useCurrentRoomIdStore";
import { RoomChatInput } from "./RoomChatInput";
import { RoomChatList } from "./RoomChatList";
import { RoomChatMentions } from "./RoomChatMentions";
import { useRoomChatStore } from "./useRoomChatStore";
import { View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../constants/dogeStyle";

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
    <SafeAreaView
      style={[
        style,
        {
          backgroundColor: colors.primary800,
          padding: 10,
          justifyContent: "flex-end",
        },
      ]}
      edges={["bottom"]}
    >
      <RoomChatList room={room} />
      <RoomChatInput users={users} />
    </SafeAreaView>
  );
};
