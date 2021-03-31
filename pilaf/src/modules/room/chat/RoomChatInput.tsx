import { RoomUser } from "@dogehouse/kebab";
import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, TextInput } from "react-native";
import { colors, radius } from "../../../constants/dogeStyle";
import { createChatMessage } from "../../../lib/createChatMessage";
// import { showErrorToast } from "../../../lib/showErrorToast";
import { useConn } from "../../../shared-hooks/useConn";
// import { useTypeSafeTranslation } from "../../../shared-hooks/useTypeSafeTranslation";
// import { Input } from "../../../ui/Input";
import { customEmojis, CustomEmote } from "./EmoteData";
import { RoomChatMentions } from "./RoomChatMentions";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { useRoomChatStore } from "./useRoomChatStore";

interface ChatInputProps {
  users: RoomUser[];
}

export const RoomChatInput: React.FC<ChatInputProps> = ({ users }) => {
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

  const navigateThroughQueriedUsers = (e: any) => {
    // Use dom method, GlobalHotkeys apparently don't catch arrow-key events on inputs
    if (
      !["ArrowUp", "ArrowDown", "Enter"].includes(e.code) ||
      !queriedUsernames.length
    ) {
      return;
    }

    e.preventDefault();

    let changeToIndex: number | null = null;
    const activeIndex = queriedUsernames.findIndex(
      (username) => username.id === activeUsername
    );

    if (e.code === "ArrowUp") {
      changeToIndex =
        activeIndex === 0 ? queriedUsernames.length - 1 : activeIndex - 1;
    } else if (e.code === "ArrowDown") {
      changeToIndex =
        activeIndex === queriedUsernames.length - 1 ? 0 : activeIndex + 1;
    } else if (e.code === "Enter") {
      const selected = queriedUsernames[activeIndex];
      setMentions([...mentions, selected]);
      setMessage(
        `${message.substring(0, message.lastIndexOf("@") + 1)}${
          selected.username
        } `
      );
      setQueriedUsernames([]);
    }

    // navigate to next/prev mention suggestion item
    if (changeToIndex !== null) {
      setActiveUsername(queriedUsernames[changeToIndex]?.id);
    }
  };

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
    <KeyboardAvoidingView behavior={"padding"}>
      <RoomChatMentions users={users} />
      <TextInput
        placeholder={"Send a message"}
        placeholderTextColor={colors.primary300}
        autoCorrect={false}
        style={{
          height: 40,
          backgroundColor: colors.primary700,
          paddingHorizontal: 16,
          borderRadius: radius.m,
          color: colors.text,
        }}
        value={message}
        onSubmitEditing={handleSubmit}
        onChangeText={(value) => setMessage(value)}
      />
    </KeyboardAvoidingView>
  );
};
