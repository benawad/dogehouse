import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { wsend } from "../../../createWebsocket";
import { meAtom } from "../../atoms";
import { modalAlert } from "../../components/AlertModal";
import { useRoomChatStore } from "./useRoomChatStore";
import { createChatMessage } from "../../utils/createChatMessage";
import { Smile } from "react-feather";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";

interface ChatInputProps {}

export const RoomChatInput: React.FC<ChatInputProps> = () => {
  const { message, setMessage } = useRoomChatStore();
  const {
    setQueriedUsernames,
    queriedUsernames,
    mentions,
    setMentions,
    activeUsername,
    setActiveUsername,
  } = useRoomChatMentionStore();
  const [me] = useAtom(meAtom);
  const [isEmoji, setIsEmoji] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messageTimeout, setMessageTimeout] = useState<boolean>(false);
  
  let timeout: number = 0;
  let position: number = 0;
  
  // Prevents memory leaks
  useEffect(() => () => clearTimeout(timeout), [timeout]);
  
  const navigateThroughQueriedUsers = (e: any) => {
    // Use dom method, GlobalHotkeys apparently don't catch arrow-key events on inputs
    if (!["ArrowUp", "ArrowDown", "Enter"].includes(e.code) || !queriedUsernames.length) return;
    
    e.preventDefault();

    let changeToIndex = null;
    const activeIndex = queriedUsernames.findIndex((username) => username.id === activeUsername);

    if (e.code === "ArrowUp") {
      changeToIndex = activeIndex === 0 ? queriedUsernames.length - 1 : activeIndex - 1;
    } else if (e.code === "ArrowDown") {
      changeToIndex = activeIndex === queriedUsernames.length - 1 ? 0 : activeIndex + 1;
    } else if (e.code === "Enter") {
      const selected = queriedUsernames[activeIndex];
      setMentions([...mentions, selected]);
      setMessage(`${message.substring(0, message.lastIndexOf("@") + 1)} ${selected.username} `);
      setQueriedUsernames([]);
    }

    // navigate to next/prev mention suggestion item
    if (changeToIndex !== null) {
      setActiveUsername(queriedUsernames[changeToIndex]?.id);
    }
  }

  const addEmoji = (emoji: any) => {
    position = (position === 0 ? inputRef!.current!.selectionStart : position + 2) || 0;
  
    const newMsg = [
      message.slice(0, position),
      emoji.native,
      message.slice(position),
    ].join("");
    setMessage(newMsg);
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (!message || !message.trim() || !message.replace(/[\u200B-\u200D\uFEFF]/g, "")) return;
      
      if (!me) return;
      
      if (me.id in useRoomChatStore.getState().bannedUserIdMap) {
          modalAlert("You got banned from chat");
          return;
      }
      
      if (messageTimeout) {
          if (!toast.isActive("message-timeout")) {
              toast(
                  "You have to wait a second before sending another message",
                  {
                      toastId: "message-timeout",
                      type: "warning",
                      autoClose: 3000
                  }
              );
          }
          
          return;
      }
      
      const tmp = message;
      setMessage("");
      wsend({
          op: "send_room_chat_msg",
          d: { tokens: createChatMessage(tmp, mentions) },
      });
      setQueriedUsernames([]);
      
      setMessageTimeout(true);
      
      timeout = window.setTimeout(() => {
          setMessageTimeout(false);
      }, 1000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-simple-gray-26 pb-8 px-8 pt-1`}
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
            height: "400px",
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
          className={`absolute mt-3 right-12 cursor-pointer`}
          onClick={() => {
            setIsEmoji(!isEmoji);
            position = 0;
          }}
        >
          <Smile style={{ inlineSize: '23px' }} />
        </div>
        <input
          maxLength={512}
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={inputRef}
          className={`w-full text-simple-gray-9c bg-simple-gray-59 px-4 py-3 rounded text-lg focus:outline-none pr-12`}
          autoComplete="off"
          onKeyDown={navigateThroughQueriedUsers}
          onFocus={() => {
            setIsEmoji(false);
            position = 0;
          }}
          id="room-chat-input"
        />
      </div>
    </form>
  );
};
