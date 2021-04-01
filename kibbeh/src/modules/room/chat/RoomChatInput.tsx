import { RoomUser } from "@dogehouse/kebab";
import React, { useRef, useState } from "react";
import { Smiley } from "../../../icons";
import { createChatMessage } from "../../../lib/createChatMessage";
import { showErrorToast } from "../../../lib/showErrorToast";
import { useConn } from "../../../shared-hooks/useConn";
import { useTypeSafeTranslation } from "../../../shared-hooks/useTypeSafeTranslation";
import { Input } from "../../../ui/Input";
import { customEmojis, CustomEmote } from "./EmoteData";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { useRoomChatStore } from "./useRoomChatStore";
import { EmojiPicker } from "../../../ui/EmojiPicker";

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
  const { t } = useTypeSafeTranslation();

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

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!me) return;

    if (me.id in useRoomChatStore.getState().bannedUserIdMap) {
      showErrorToast(t("modules.roomChat.bannedAlert"));
      return;
    }

    if (Date.now() - lastMessageTimestamp <= 1000) {
      showErrorToast(t("modules.roomChat.waitAlert"));

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
  };

  return (
    <form onSubmit={handleSubmit} className={`pb-3 px-4 pt-2 flex flex-col`}>
      {isEmoji ? (
        <div className={`mb-1`}>
          <EmojiPicker
            emojiSet={customEmojis}
            onEmojiSelect={(emoji) => {
              position =
                (position === 0
                  ? inputRef!.current!.selectionStart
                  : position + 2) || 0;

              const newMsg = [
                message.slice(0, position),
                (message.endsWith(" ") ? "" : " ") +
                  (`:${emoji.short_names[0]}:` || "") +
                  " ",
                message.slice(position),
              ].join("");
              setMessage(newMsg);
            }}
          />
        </div>
      ) : null}
      <div className="flex items-stretch">
        <div className="flex-1 mr-2 lg:mr-0 items-center bg-primary-700 rounded-8 flex-row">
          <Input
            maxLength={512}
            placeholder={t("modules.roomChat.sendMessage")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="room-chat-input"
            transparent={true}
            ref={inputRef}
            autoComplete="off"
            onKeyDown={navigateThroughQueriedUsers}
            onFocus={() => {
              setIsEmoji(false);
              position = 0;
            }}
          />
          <div
            style={{
              color: "rgb(167, 167, 167)",
              display: "flex",
              marginRight: 13,
              flexDirection: "row-reverse",
            }}
            className={`right-12 cursor-pointer`}
            onClick={() => {
              setIsEmoji(!isEmoji);
              position = 0;
            }}
          >
            <Smiley style={{ inlineSize: "23px" }}></Smiley>
          </div>
        </div>

        {/* Send button (mobile only) */}
        {/* {chatIsSidebar ? null : (
          <Button
            onClick={handleSubmit}
            variant="small"
            style={{ padding: "10px 12px" }}
          >
            <Codicon name="arrowRight" />
          </Button>
        )} */}
      </div>
    </form>
  );
};
