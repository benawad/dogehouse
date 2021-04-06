import { Room, RoomUser } from "@dogehouse/kebab";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, View, ViewStyle, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../constants/dogeStyle";
import { EmotePicker } from "./EmotePicker";
import { RoomChatControls } from "./RoomChatControls";
import { RoomChatInput } from "./RoomChatInput";
import { RoomChatList } from "./RoomChatList";
import { useRoomChatStore } from "./useRoomChatStore";
import { useKeyboard } from "@react-native-community/hooks";

interface ChatProps {
  room: Room;
  users: RoomUser[];
  style: ViewStyle;
}

export const RoomChat: React.FC<ChatProps> = ({ users, room, style }) => {
  const inset = useSafeAreaInsets();
  const [emoteOpen, setEmoteOpen] = useState(false);
  const { message, setMessage } = useRoomChatStore();
  const keyboard = useKeyboard();
  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", _keyboardDidShow);
    Keyboard.addListener("keyboardWillHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardWillShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardWillHide", _keyboardDidHide);
    };
  }, []);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const _keyboardDidShow = (event) => {
    Keyboard.scheduleLayoutAnimation(event);
    setKeyboardStatus(true);
  };
  const _keyboardDidHide = (event) => {
    Keyboard.scheduleLayoutAnimation(event);
    setKeyboardStatus(false);
  };
  return (
    <View
      style={[
        style,
        {
          backgroundColor: colors.primary900,
          justifyContent: "flex-end",
          paddingBottom: 10 + inset.bottom,
          // flex: 1,
        },
      ]}
    >
      <RoomChatControls />
      <RoomChatList room={room} />
      {emoteOpen && (
        <EmotePicker
          style={{
            position: "absolute",
            // display: emoteOpen ? "flex" : "none",
            bottom: inset.bottom + 60,
            height: keyboardStatus ? "25%" : "50%",
            left: 25,
            right: 25,
            marginBottom: keyboardStatus
              ? keyboard.keyboardHeight - inset.bottom
              : 0,
          }}
          isNitro={false}
          onEmoteSelected={(emote) => {
            setMessage(message + ":" + emote.name + ":");
            setEmoteOpen(false);
          }}
        />
      )}
      <RoomChatInput
        users={users}
        onEmotePress={() => setEmoteOpen(!emoteOpen)}
        style={{
          paddingHorizontal: 25,
          marginBottom: keyboardStatus
            ? keyboard.keyboardHeight - inset.bottom
            : 0,
        }}
      />
    </View>
  );
};
