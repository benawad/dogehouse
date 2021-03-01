import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { useCurrentRoomStore } from "../../../webrtc/stores/useCurrentRoomStore";
import { meAtom } from "../../atoms";
import { Avatar } from "../../components/Avatar";
import { BaseUser } from "../../types";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { useRoomChatStore } from "./useRoomChatStore";

interface RoomChatMentionsProps {}

export const RoomChatMentions: React.FC<RoomChatMentionsProps> = ({}) => {
  const { currentRoom } = useCurrentRoomStore();
  const [me] = useAtom(meAtom);

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
    if (mentionMatches && me && currentRoom) {
      const mentionsList = mentionMatches[0].replace(/@|#/g, "").split(" ");
      const useMention = mentionsList[mentionsList.length - 1];

      // hide usernames list if user continues typing without selecting
      if (message[message.lastIndexOf(useMention) + useMention.length]) {
        setQueriedUsernames([]);
      } else {
        const usernameMatches = currentRoom.users.filter(
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
      <div className={`flex flex-col pb-1 bg-simple-gray-26`}>
        {queriedUsernames.map((m) => (
          <button
            className={`flex py-3 items-center px-8 focus:outline-none ${
              activeUsername === m.id ? "bg-blue-800" : ""
            }`}
            key={m.id}
            onClick={() => addMention(m)}
          >
            <span className={`pr-3 inline`}>
              <Avatar size={20} src={m.avatarUrl} />
            </span>
            <p className={`m-0 mt-1`}>
              {m.displayName}
              {m.displayName !== m.username ? `(${m.username})` : null}
            </p>
          </button>
        ))}
      </div>
    );
  }

  return <></>;
};
