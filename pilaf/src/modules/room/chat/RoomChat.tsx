import { Room, RoomUser } from "@dogehouse/kebab";
import { useKeyboard } from "@react-native-community/hooks";
import { useNavigation } from "@react-navigation/core";
import React, { MutableRefObject, useEffect, useState } from "react";
import { Keyboard, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet from "reanimated-bottom-sheet";
import { colors } from "../../../constants/dogeStyle";
import { useConn } from "../../../shared-hooks/useConn";
import { useCurrentRoomInfo } from "../../../shared-hooks/useCurrentRoomInfo";
import { EmotePicker } from "./EmotePicker";
import { RoomChatControls } from "./RoomChatControls";
import { RoomChatInput } from "./RoomChatInput";
import { RoomChatList } from "./RoomChatList";
import { RoomChatMessage, useRoomChatStore } from "./useRoomChatStore";

interface ChatProps {
  room: Room;
  users: RoomUser[];
  style: ViewStyle;
  wrapperRef: MutableRefObject<BottomSheet>;
}

export const RoomChat: React.FC<ChatProps> = ({
  users,
  room,
  style,
  wrapperRef,
}) => {
  const inset = useSafeAreaInsets();
  const [emoteOpen, setEmoteOpen] = useState(false);
  const { message, setMessage } = useRoomChatStore();
  const keyboard = useKeyboard();
  const navigation = useNavigation();
  const { canSpeak } = useCurrentRoomInfo();
  const conn = useConn();
  const me = users.find((u) => u.id === conn.user.id);
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
      <RoomChatControls
        room={room}
        amISpeaker={canSpeak}
        amIAskingForSpeak={me.roomPermissions?.askedToSpeak}
      />
      <RoomChatList
        room={room}
        onUsernamePress={(userId: string, message?: RoomChatMessage) => {
          navigation.navigate("RoomUserPreview", { userId, message });
          wrapperRef.current.snapTo(1);
        }}
      />
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
