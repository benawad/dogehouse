import { BaseUser, RoomUser } from "@dogehouse/kebab";
import React, { useEffect } from "react";
import { useConn } from "../../../shared-hooks/useConn";
import { SingleUserAvatar } from "../../../components/avatars/SingleUserAvatar";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { useRoomChatStore } from "./useRoomChatStore";
import { View, Text, TouchableOpacity } from "react-native";
import { colors, h4, paragraph, radius } from "../../../constants/dogeStyle";

interface RoomChatMentionsProps {
  users: RoomUser[];
}

export const RoomChatMentions: React.FC<RoomChatMentionsProps> = ({
  users,
}) => {
  const me = useConn().user;

  const { message, setMessage } = useRoomChatStore();

  const {
    activeUsername,
    setActiveUsername,
    queriedUsernames,
    setQueriedUsernames,
    mentions,
    setMentions,
  } = useRoomChatMentionStore();

  function addMention(m: BaseUser) {
    setMentions([...mentions, m]);
    setMessage(
      message.substring(0, message.lastIndexOf("@") + 1) + m.username + " "
    );
    setQueriedUsernames([]);
  }

  useEffect(() => {
    // regex to match mention patterns
    const mentionMatches = message.match(/^(?!.*\bRT\b)(?:.+\s)?#?@\w+/i);

    // query usernames for matched patterns
    if (mentionMatches && me) {
      const mentionsList = mentionMatches[0].replace(/@|#/g, "").split(" ");
      const useMention = mentionsList[mentionsList.length - 1];

      // hide usernames list if user continues typing without selecting
      if (message[message.lastIndexOf(useMention) + useMention.length]) {
        setQueriedUsernames([]);
      } else {
        const usernameMatches = users.filter(
          ({ id, username, displayName }) =>
            (username?.toLowerCase().includes(useMention?.toLowerCase()) ||
              displayName?.toLowerCase().includes(useMention?.toLowerCase())) &&
            !mentions.find((m: BaseUser) => m.id === id) &&
            me.id !== id
        );

        const firstFive = usernameMatches.slice(0, 5);
        setQueriedUsernames(firstFive);
        if (firstFive.length) setActiveUsername(firstFive[0].id);
      }
    } else {
      // Hide mentions when message is sent
      setQueriedUsernames([]);
    }

    // Remove mention if user deleted text
    setMentions(
      mentions.filter((u) => {
        return message.toLowerCase().indexOf(u.username?.toLowerCase()) !== -1;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);
  if (queriedUsernames.length) {
    return (
      <View
        style={{
          position: "absolute",
          backgroundColor: colors.primary700,
          width: "100%",
          alignSelf: "center",
          bottom: 34,
          paddingBottom: 5,
          borderTopLeftRadius: radius.m,
          borderTopRightRadius: radius.m,
        }}
      >
        {queriedUsernames.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}
            onPress={() => addMention(m)}
          >
            <SingleUserAvatar src={{ uri: m.avatarUrl }} size={"xxs"} />
            <Text style={{ ...paragraph, marginLeft: 10 }}>
              {m.displayName}
              {m.displayName !== m.username ? ` (${m.username})` : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
  return <></>;
};
