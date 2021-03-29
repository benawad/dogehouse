import { BaseUser, RoomUser } from "@dogehouse/kebab";
import React, { useEffect } from "react";
import { useConn } from "../../../shared-hooks/useConn";
import { SingleUser } from "../../../ui/UserAvatar";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { useRoomChatStore } from "./useRoomChatStore";

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

    // Re-focus input after mention was clicked
    document.getElementById("room-chat-input")?.focus();
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
      <div className={`flex flex-col pb-1 bg-primary-800`}>
        {queriedUsernames.map((m) => (
          <button
            className={`flex py-3 items-center px-6 justify-start focus:outline-none ${
              activeUsername === m.id ? "bg-primary-700" : ""
            }`}
            key={m.id}
            onClick={() => addMention(m)}
          >
            <SingleUser size="xs" src={m.avatarUrl} />
            <p className={`pl-3 m-0 text-primary-200`}>
              {m.displayName}
              {m.displayName !== m.username ? ` (${m.username})` : null}
            </p>
          </button>
        ))}
      </div>
    );
  }

  return <></>;
};
