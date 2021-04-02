import { Room, RoomUser } from "@dogehouse/kebab";
import React, { useEffect, useState } from "react";
import { useCurrentRoomIdStore } from "../../../global-stores/useCurrentRoomIdStore";
import { RoomChatInput } from "./RoomChatInput";
import { RoomChatList } from "./RoomChatList";
import { RoomChatMentions } from "./RoomChatMentions";
import { useRoomChatStore } from "./useRoomChatStore";
import { View, ViewStyle } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { colors } from "../../../constants/dogeStyle";
import { EmotePicker } from "./EmotePicker";

interface ChatProps {
  room: Room;
  users: RoomUser[];
  style: ViewStyle;
}

export const RoomChat: React.FC<ChatProps> = ({ users, room, style }) => {
  const safeAreaInset = useSafeAreaInsets();
  const [emoteOpen, setEmoteOpen] = useState(false);
  const { message, setMessage } = useRoomChatStore();

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
      <EmotePicker
        style={{
          position: "absolute",
          display: emoteOpen ? "flex" : "none",
          bottom: safeAreaInset.bottom + 60,
          top: 10,
          left: 10,
          right: 10,
        }}
        isNitro={false}
        onEmoteSelected={(emote) => {
          console.log(emote.name);
          setMessage(message + ":" + emote.name + ":");
          setEmoteOpen(false);
        }}
      />
      <RoomChatInput
        users={users}
        onEmotePress={() => setEmoteOpen(!emoteOpen)}
      />
    </SafeAreaView>
  );
};
