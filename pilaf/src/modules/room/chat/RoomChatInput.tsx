import { RoomUser } from "@dogehouse/kebab";
import React, { useRef, useState } from "react";
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { colors, radius } from "../../../constants/dogeStyle";
import { createChatMessage } from "../../../lib/createChatMessage";
import { useConn } from "../../../shared-hooks/useConn";
import { RoomChatMentions } from "./RoomChatMentions";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { useRoomChatStore } from "./useRoomChatStore";

interface ChatInputProps {
  style: ViewStyle;
  users: RoomUser[];
  onEmotePress: () => void;
}

export const RoomChatInput: React.FC<ChatInputProps> = ({
  users,
  onEmotePress,
  style,
}) => {
  const { message, setMessage } = useRoomChatStore();
  const {
    setQueriedUsernames,
    queriedUsernames,
    mentions,
    setMentions,
    activeUsername,
    setActiveUsername,
  } = useRoomChatMentionStore();
  const conn = useConn();
  const me = conn.user;
  const [isEmoji, setIsEmoji] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number>(0);

  let position = 0;

  const handleSubmit = () => {
    if (!me) return;
    if (me.id in useRoomChatStore.getState().bannedUserIdMap) {
      // showErrorToast(t("modules.roomChat.bannedAlert"));
      return;
    }

    if (Date.now() - lastMessageTimestamp <= 1000) {
      // showErrorToast(t("modules.roomChat.waitAlert"));

      return;
    }
    const tmp = message;
    const messageData = createChatMessage(tmp, mentions, users);
    // dont empty the input, if no tokens
    if (!messageData.tokens.length) return;
    setMessage("");
    if (
      !message ||
      !message.trim() ||
      !message.replace(/[\u200B-\u200D\uFEFF]/g, "")
    ) {
      return;
    }

    conn.send("send_room_chat_msg", messageData);
    setQueriedUsernames([]);

    setLastMessageTimestamp(Date.now());

    setMessage("");
  };

  return (
    <View style={style}>
      <RoomChatMentions users={users} />
      <View
        style={{
          flexDirection: "row",
          height: 40,
          backgroundColor: colors.primary700,
          paddingHorizontal: 16,
          borderRadius: radius.m,
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInput
            placeholder={"Send a message"}
            placeholderTextColor={colors.primary300}
            autoCorrect={false}
            style={{
              height: 40,
              color: colors.text,
            }}
            value={message}
            onSubmitEditing={handleSubmit}
            onChangeText={(value) => setMessage(value)}
          />
        </View>

        <TouchableOpacity
          style={{ alignSelf: "center", flexShrink: 0, marginLeft: 10 }}
          onPress={onEmotePress}
        >
          <Image source={require("../../../assets/images/emoji-icon.png")} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
