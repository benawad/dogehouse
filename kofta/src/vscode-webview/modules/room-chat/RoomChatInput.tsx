import { useAtom } from "jotai";
import React, { createRef, useState } from "react";
import { tw } from "twind";
import { wsend } from "../../../createWebsocket";
import { meAtom } from "../../atoms";
import { modalAlert } from "../../components/AlertModal";
import { useRoomChatStore } from "./useRoomChatStore";
import { createChatMessage } from "../../utils/createChatMessage";
import { Smile } from "react-feather";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

interface ChatInputProps {}

let position: number = 0;
export const RoomChatInput: React.FC<ChatInputProps> = ({}) => {
  const {
    message,
    setMessage,
    setQueriedUsernames,
    queriedUsernames,
    mentions,
    setMentions,
    activeUsername,
    setActiveUsername,
  } = useRoomChatStore();
  const [me] = useAtom(meAtom);
  const inputRef = createRef<HTMLInputElement>();
  function navigateThroughQueriedUsers(e: any) {
    // Use dom method, GlobalHotkeys apparently don't catch arrow-key events on inputs
    if (
      !["ArrowUp", "ArrowDown", "Enter"].includes(e.code) ||
      !queriedUsernames.length
    )
      return;
    e.preventDefault();

    let changeToIndex = null;
    const activeIndex = queriedUsernames.findIndex(
      (u) => u.id === activeUsername
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
        message.substring(0, message.lastIndexOf("@") + 1) +
          selected.username +
          " "
      );
      setQueriedUsernames([]);
    }

    // navigate to next/prev mention suggestion item
    if (changeToIndex !== null)
      setActiveUsername(queriedUsernames[changeToIndex]?.id);
  }
  const [isEmoji, setisEmoji] = useState(false);

  const addEmoji = (emoji: any) => {
    if (position === 0) position = inputRef.current!.selectionStart!;
    else position = position + 2;
    const newMsg = [
      message.slice(0, position),
      emoji.native,
      message.slice(position),
    ].join("");
    setMessage(newMsg);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (
          !message ||
          !message.trim() ||
          !message.replace(/[\u200B-\u200D\uFEFF]/g, "")
        ) {
          return;
        }
        if (!me) {
          return;
        }
        if (me.id in useRoomChatStore.getState().bannedUserIdMap) {
          modalAlert("you got banned from chat");
          return;
        }
        const tmp = message;
        setMessage("");
        wsend({
          op: "send_room_chat_msg",
          d: { tokens: createChatMessage(tmp, mentions) },
        });
        setQueriedUsernames([]);
      }}
      className={tw`bg-tmpBg1 pb-8 px-8 pt-1`}
    >
      {isEmoji ? (
        <Picker
          set="apple"
          onSelect={(emoji) => {
            addEmoji(emoji);
          }}
          style={{
            position: "relative",
            width: "100%",
            height: "200px",
            overflowY: "hidden",
          }}
          sheetSize={32}
          theme="dark"
          emojiTooltip={false}
          showPreview={false}
          showSkinTones={false}
          i18n={{
            search: "Search",
            categories: {
              search: "Search Results",
              recent: "Frequently Used",
            },
          }}
        />
      ) : null}
      <div>
        <div
          style={{
            color: "rgb(167, 167, 167)",
          }}
          className={tw`absolute mt-3 right-12 cursor-pointer`}
          onClick={() => {
            setisEmoji(!isEmoji);
            position = 0;
          }}
        >
          <Smile style={{ inlineSize: "23px" }}></Smile>
        </div>
        <input
          maxLength={512}
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={inputRef}
          className={tw`text-tmpC1 bg-tmpBg4 px-4 py-3 rounded text-lg focus:outline-none pr-12`}
          onKeyDown={navigateThroughQueriedUsers}
          onFocus={() => {
            setisEmoji(false);
            position = 0;
          }}
        />
      </div>
    </form>
  );
};
