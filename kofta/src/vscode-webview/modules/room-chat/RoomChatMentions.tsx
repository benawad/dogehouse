import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { tw } from "twind";
import { useRoomChatStore } from "./useRoomChatStore";
import { Avatar } from "../../components/Avatar";
import { User } from "../../types";
import { currentRoomAtom, meAtom } from "../../atoms";

interface RoomChatMentionsProps {}

export const RoomChatMentions: React.FC<RoomChatMentionsProps> = ({}) => {
  const [currentRoom] = useAtom(currentRoomAtom);
  const [me] = useAtom(meAtom);

  const {
    queriedUsernames,
    setQueriedUsernames,
    mentions,
    setMentions,
    message,
    setMessage,
    activeUsername,
    setActiveUsername,
  } = useRoomChatStore();

  function addMention(m: User) {
    setMentions([...mentions, m]);
    setMessage(
      message.substring(0, message.lastIndexOf("@") + 1) + m.username + " "
    );
    setQueriedUsernames([]);
  }

  useEffect(() => {
    // regex to match mention patterns
    const mentionMatches = message.match(/^(?!.*\bRT\b)(?:.+\s)?@\w+/i);

    // query usernames for matched patterns
    if (mentionMatches && me && currentRoom) {
      const mentionsList = mentionMatches[0].replace(/@/g, "").split(" ");
      const useMention = mentionsList[mentionsList.length - 1];

      // hide usernames list if user continues typing without selecting
      if (message[message.lastIndexOf(useMention) + useMention.length]) {
        setQueriedUsernames([]);
      } else {
        const usernameMatches = currentRoom.users.filter(
          ({ id, username, displayName }) =>
            (username.toLowerCase().includes(useMention.toLowerCase()) ||
              displayName.toLowerCase().includes(useMention.toLowerCase())) &&
            !mentions.find((m) => m.id === id) &&
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
        return message.toLowerCase().indexOf(u.username.toLowerCase()) !== -1;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  if (queriedUsernames.length) {
    return (
      <div className={tw`flex flex-col pb-1`}>
        {queriedUsernames.map((m) => (
          <button
            className={tw`flex py-3 items-center px-8 focus:outline-none ${
              activeUsername === m.id ? "bg-buttonHover" : ""
            }`}
            key={m.id}
            onClick={() => addMention(m)}
          >
            <span className={tw`pr-3 inline`}>
              <Avatar
                style={{ display: "inline" }}
                size={20}
                src={m.avatarUrl}
              />
            </span>
            <p className={tw`m-0 mt-1`}>
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
