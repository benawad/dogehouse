import { Room, RoomUser } from "@dogehouse/kebab";
import React, { useState } from "react";
import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../constants/dogeStyle";
import { EmotePicker } from "./EmotePicker";
import { RoomChatInput } from "./RoomChatInput";
import { RoomChatList } from "./RoomChatList";
import { useRoomChatStore } from "./useRoomChatStore";

interface ChatProps {
  room: Room;
  users: RoomUser[];
  style: ViewStyle;
}

export const RoomChat: React.FC<ChatProps> = ({ users, room, style }) => {
  const inset = useSafeAreaInsets();
  const [emoteOpen, setEmoteOpen] = useState(false);
  const { message, setMessage } = useRoomChatStore();

  return (
    <View
      style={[
        style,
        {
          backgroundColor: colors.primary800,
          padding: 10,
          justifyContent: "flex-end",
          paddingBottom: 10 + inset.bottom,
        },
      ]}
    >
      <RoomChatList room={room} />
      <EmotePicker
        style={{
          position: "absolute",
          display: emoteOpen ? "flex" : "none",
          bottom: inset.bottom + 60,
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
    </View>
  );
};
