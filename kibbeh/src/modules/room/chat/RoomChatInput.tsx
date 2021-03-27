import { RoomUser } from "@dogehouse/kebab";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import React, { useRef, useState } from "react";
import { createChatMessage } from "../../../lib/createChatMessage";
import { showErrorToast } from "../../../lib/showErrorToast";
import { useConn } from "../../../shared-hooks/useConn";
import { useTypeSafeTranslation } from "../../../shared-hooks/useTypeSafeTranslation";
import { Input } from "../../../ui/Input";
import { customEmojis, CustomEmote } from "./EmoteData";
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
    <form onSubmit={handleSubmit} className={`pb-3 px-4 pt-5 flex flex-col`}>
      {isEmoji ? (
        <Picker
          set="apple"
          onSelect={(emoji: CustomEmote) => {
            position =
              (position === 0
                ? inputRef!.current!.selectionStart
                : position + 2) || 0;

            const newMsg = [
              message.slice(0, position),
              "native" in emoji
                ? emoji.native
                : (message.endsWith(" ") ? "" : " ") +
                  (emoji.colons || "") +
                  " ",
              message.slice(position),
            ].join("");
            setMessage(newMsg);
          }}
          style={{
            position: "relative",
            width: "100%",
            minWidth: "278px",
            right: 0,
            overflowY: "hidden",
            outline: "none",
            alignSelf: "flex-end",
            margin: "0 0 8px 0",
          }}
          sheetSize={32}
          theme="dark"
          custom={customEmojis}
          emojiTooltip={true}
          showPreview={false}
          showSkinTones={false}
          i18n={{
            search: t("modules.roomChat.search"),
            categories: {
              search: t("modules.roomChat.searchResults"),
              recent: t("modules.roomChat.recent"),
            },
          }}
        />
      ) : null}
      <div className="flex items-stretch">
        <div className="flex-1 mr-2 lg:mr-0 items-end">
          <Input
            maxLength={512}
            placeholder={t("modules.roomChat.sendMessage")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`bg-primary-700`}
            ref={inputRef}
            autoComplete="off"
            onKeyDown={navigateThroughQueriedUsers}
            onFocus={() => {
              setIsEmoji(false);
              position = 0;
            }}
            id="room-chat-input"
          />
          {/* <div
            style={{
              color: "rgb(167, 167, 167)",
              display: "flex",
              marginRight: 13,
              marginTop: -35,
              flexDirection: "row-reverse",
            }}
            className={`mt-3 right-12 cursor-pointer`}
            onClick={() => {
              setIsEmoji(!isEmoji);
              position = 0;
            }}
          >
            {/* @todo set correct icon
            <SolidCompass style={{ inlineSize: "23px" }}></SolidCompass>
          </div> */}
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
