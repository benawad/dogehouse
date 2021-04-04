import { Room } from "@dogehouse/kebab";
import normalizeUrl from "normalize-url";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useConn } from "../../../shared-hooks/useConn";
import { useCurrentRoomInfo } from "../../../shared-hooks/useCurrentRoomInfo";
import { useTypeSafeTranslation } from "../../../shared-hooks/useTypeSafeTranslation";
import { UserPreviewModalContext } from "../UserPreviewModalProvider";
import { emoteMap } from "./EmoteData";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { RoomChatMessage, useRoomChatStore } from "./useRoomChatStore";

interface ChatListProps {
  room: Room;
}

export const RoomChatList: React.FC<ChatListProps> = ({ room }) => {
  const { setData } = useContext(UserPreviewModalContext);
  const messages = useRoomChatStore((s) => s.messages);
  const me = useConn().user;
  const { isMod: iAmMod, isCreator: iAmCreator } = useCurrentRoomInfo();
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const chatListRef = useRef<null | HTMLDivElement>(null);
  const {
    isRoomChatScrolledToTop,
    setIsRoomChatScrolledToTop,
  } = useRoomChatStore();
  const { t } = useTypeSafeTranslation();

  // Only scroll into view if not manually scrolled to top
  useEffect(() => {
    if (!isRoomChatScrolledToTop) {
      chatListRef.current?.scrollTo(0, chatListRef.current.scrollHeight);
    }
  });

  return (
    <div
      className={`px-5 flex-1 overflow-y-auto flex-col flex chat-message-container scrollbar-thin scrollbar-thumb-primary-700`}
      ref={chatListRef}
      onScroll={() => {
        if (!chatListRef.current) return;
        const { scrollTop, offsetHeight, scrollHeight } = chatListRef.current;
        const isOnBottom =
          Math.abs(scrollTop + offsetHeight - scrollHeight) <= 1;

        setIsRoomChatScrolledToTop(!isOnBottom);
        if (isOnBottom) {
          useRoomChatMentionStore.getState().resetIAmMentioned();
        }
      }}
    >
      {messages
        .slice()
        .reverse()
        .map((m, idx) => (
          <div
            style={{ marginTop: idx === 0 ? "auto" : undefined }}
            className={`flex flex-col flex-shrink-0 ${
              m.isWhisper ? "bg-primary-700 rounded my-1" : ""
            }`}
            key={m.id}
          >
            {/* Whisper label */}
            {m.isWhisper ? (
              <p className="mb-0 text-sm text-primary-300 px-1 w-16 mt-1 text-center">
                {t("modules.roomChat.whisper")}
              </p>
            ) : null}
            <div className={`flex items-center px-1`}>
              <div
                className={`py-1 block break-words max-w-full items-start flex-1 text-primary-100`}
                key={m.id}
              >
                <button
                  onClick={() => {
                    setData({
                      userId: m.userId,
                      message:
                        (me?.id === m.userId ||
                          iAmCreator ||
                          (iAmMod && room.creatorId !== m.userId)) &&
                        !m.deleted
                          ? m
                          : undefined,
                    });
                  }}
                  className={`inline hover:underline font-bold focus:outline-none font-mono`}
                  style={{ textDecorationColor: m.color, color: m.color }}
                >
                  {m.username}
                </button>

                <span className={`inline mr-1`}>: </span>
                <div className={`inline mr-1 space-x-1`}>
                  {m.deleted ? (
                    <span className="inline text-primary-300">
                      [message{" "}
                      {m.deleterId === m.userId ? "retracted" : "deleted"}]
                    </span>
                  ) : (
                    m.tokens.map(({ t: token, v }, i) => {
                      switch (token) {
                        case "text":
                          return (
                            <React.Fragment key={i}>{`${v} `}</React.Fragment>
                          );
                        case "emote":
                          return emoteMap[v] ? (
                            <img
                              key={i}
                              className="inline"
                              alt={`:${v}:`}
                              src={emoteMap[v]}
                            />
                          ) : (
                            ":" + v + ":"
                          );

                        case "mention":
                          return (
                            <React.Fragment key={i}>
                              <button
                                onClick={() => {
                                  setData({ userId: v });
                                }}
                                className={`inline hover:underline flex-1 focus:outline-none ${
                                  v === me?.username
                                    ? "bg-accent text-white px-1 rounded text-md"
                                    : ""
                                }`}
                                style={{
                                  textDecorationColor: m.color,
                                  color: v === me?.username ? "" : m.color,
                                }}
                              >
                                @{v}
                              </button>{" "}
                            </React.Fragment>
                          );
                        case "link":
                          return (
                            <a
                              target="_blank"
                              rel="noreferrer noopener"
                              href={v}
                              className={`inline flex-1 hover:underline text-accent`}
                              key={i}
                            >
                              {normalizeUrl(v, { stripProtocol: true })}{" "}
                            </a>
                          );
                        case "block":
                          return (
                            <span key={i}>
                              <span
                                className={
                                  "inline bg-simple-gray-33 rounded whitespace-pre-wrap font-mono"
                                }
                              >
                                {v}
                              </span>{" "}
                            </span>
                          );
                        default:
                          return null;
                      }
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      {/* {messages.length === 0 ? (
        <div>{t("modules.roomChat.welcomeMessage")}</div>
      ) : null} */}
      <div ref={bottomRef} />
    </div>
  );
};
