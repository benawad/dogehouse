import { Room, RoomUser, UserWithFollowInfo } from "@dogehouse/kebab";
import React, { useRef, useState, useEffect } from "react";
import { Smiley } from "../../../icons";
import { createChatMessage } from "../../../lib/createChatMessage";
import { showErrorToast } from "../../../lib/showErrorToast";
import { useConn, useWrappedConn } from "../../../shared-hooks/useConn";
import { useTypeSafeTranslation } from "../../../shared-hooks/useTypeSafeTranslation";
import { Input } from "../../../ui/Input";
import { customEmojis, CustomEmote } from "./EmoteData";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { useRoomChatStore } from "./useRoomChatStore";
import { EmojiPicker } from "../../../ui/EmojiPicker";
import { useEmojiPickerStore } from "../../../global-stores/useEmojiPickerStore";
import { navigateThroughQueriedUsers } from "./navigateThroughQueriedUsers";
import { navigateThroughQueriedEmojis } from "./navigateThroughQueriedEmojis";
import { useTypeSafeQuery } from "../../../shared-hooks/useTypeSafeQuery";
import { useCurrentRoomIdStore } from "../../../global-stores/useCurrentRoomIdStore";
import { useScreenType } from "../../../shared-hooks/useScreenType";
import { useCurrentRoomFromCache } from "../../../shared-hooks/useCurrentRoomFromCache";
import Dolma from '@dogehouse/dolma';

interface ChatInputProps {
  users: RoomUser[];
}

export const RoomChatInput: React.FC<ChatInputProps> = ({ users }) => {
  const { message, setMessage } = useRoomChatStore();
  const { setQueriedUsernames } = useRoomChatMentionStore();
  const { setOpen, open, queryMatches } = useEmojiPickerStore();
  const conn = useConn();
  const dolma = new Dolma(customEmojis);
  const wConn = useWrappedConn();
  const me = conn.user;
  const inputRef = useRef<HTMLInputElement>(null);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number>(0);
  const { t } = useTypeSafeTranslation();
  const screenType = useScreenType();

  let position = 0;

  useEffect(() => {
    if (!open && screenType !== "fullscreen") inputRef.current?.focus(); // Prevent autofocus on mobile
  }, [open, screenType]);

  const data = useCurrentRoomFromCache();

  if (data && !("error" in data) && data.room.chatMode === "disabled") {
    return (
      <p className="my-4 text-center text-primary-300">
        {t("modules.roomChat.disabled")}
      </p>
    );
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!me) return;

    if (me.id in useRoomChatStore.getState().bannedUserIdMap) {
      showErrorToast(t("modules.roomChat.bannedAlert"));
      return;
    }

    if (
      data &&
      !("error" in data) &&
      Date.now() - lastMessageTimestamp <= data.room.chatThrottle
    ) {
      showErrorToast(t("modules.roomChat.waitAlert"));
      return;
    }

    const tmp = message;
    // const messageData = createChatMessage(tmp, users);
    const messageData = dolma.encode(message);
    console.log(messageData);

    messageData.whisperedTo = await Promise.all(messageData.whisperedTo.map(async (uname = "") => {
      const u = await wConn.query.getUserProfile(uname);
      if("id" in u!) return u.id;
      return "";
    }));


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

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     conn.send("send_room_chat_msg", createChatMessage("spam"));
  //   }, 1001);

  //   return () => {
  //     clearInterval(id);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <form onSubmit={handleSubmit} className={`pb-3 px-4 pt-2 flex flex-col`}>
      <div className={`mb-1 block relative`}>
        <EmojiPicker
          emojiSet={customEmojis as any}
          onEmojiSelect={(emoji) => {
            position =
              (position === 0
                ? inputRef!.current!.selectionStart
                : position + 2) || 0;

            let msg = '';

            if ((message.match(/:/g)?.length ?? 0) % 2) {
              msg = message.split('').reverse().join('');
              msg = msg.replace(msg.split(':')[0] + ':', '');
              msg = msg.split('').reverse().join('');
            } else {
              msg = message;
            }

            const newMsg = [
              msg.slice(0, position),
              (`:${emoji.short_names[0]}:` || "") +
                " ",
              msg.slice(position),
            ].join("");
            setMessage(newMsg);
          }}
        />
      </div>
      <div className="flex items-stretch">
        <div className="flex-1">
          {data && "room" in data && data.room.chatMode === "follower_only" ? (
            <div className="text-primary-300 mb-1">Follower mode</div>
          ) : null}
          <div className="flex flex-1 lg:mr-0 items-center bg-primary-700 rounded-8">
            <Input
              maxLength={512}
              placeholder={t("modules.roomChat.sendMessage")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              id="room-chat-input"
              transparent
              ref={inputRef}
              autoComplete="off"
              onKeyDown={
                queryMatches.length
                  ? navigateThroughQueriedEmojis
                  : navigateThroughQueriedUsers
              }
              onFocus={() => {
                setOpen(false);
                position = 0;
              }}
            />
            <div
              className={`right-12 cursor-pointer flex flex-row-reverse fill-current text-primary-200 mr-3`}
              onClick={() => {
                setOpen(!open);
                position = 0;
              }}
            >
              <Smiley style={{ inlineSize: "23px" }}></Smiley>
            </div>
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
