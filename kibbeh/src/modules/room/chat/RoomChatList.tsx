import { Room } from "@dogehouse/kebab";
import normalizeUrl from "normalize-url";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useVirtual, VirtualItem } from "react-virtual";
import { useConn } from "../../../shared-hooks/useConn";
import { useCurrentRoomInfo } from "../../../shared-hooks/useCurrentRoomInfo";
import { useTypeSafeTranslation } from "../../../shared-hooks/useTypeSafeTranslation";
import { UserPreviewModalContext } from "../UserPreviewModalProvider";
import { emoteMap } from "./EmoteData";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { useRoomChatStore } from "./useRoomChatStore";

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

  const rowVirtualizer = useVirtual({
    overscan: 10,
    size: messages.length,
    parentRef: chatListRef,
    estimateSize: React.useCallback(() => 20, []),
  });

  return (
    <div
      className={`px-5 flex-1 overflow-y-auto chat-message-container scrollbar-thin scrollbar-thumb-primary-700`}
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
      <div
        className="w-full h-full mt-auto"
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.virtualItems.map(
          ({ index: idx, start, measureRef, size }: VirtualItem) => {
            const index = messages.length - idx - 1;
            return (
              <div
                ref={measureRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${
                    messages[index].isWhisper ? start : start
                  }px)`,
                }}
                key={messages[index].id}
                className="py-1"
              >
                <div
                  className={`flex flex-col flex-shrink-0 w-full ${
                    messages[index].isWhisper
                      ? "bg-primary-700 rounded p-1 pt-0"
                      : ""
                  }`}
                >
                  {/* Whisper label */}
                  {messages[index].isWhisper ? (
                    <p className="mb-0 text-sm text-primary-300 px-1 w-16 mt-1 text-center">
                      {t("modules.roomChat.whisper")}
                    </p>
                  ) : null}
                  <div className={`flex items-center px-1`}>
                    <div
                      className={`block break-words max-w-full items-start flex-1 text-primary-100`}
                      key={messages[index].id}
                    >
                      <button
                        onClick={() => {
                          setData({
                            userId: messages[index].userId,
                            message:
                              (me?.id === messages[index].userId ||
                                iAmCreator ||
                                (iAmMod &&
                                  room.creatorId !== messages[index].userId)) &&
                              !messages[index].deleted
                                ? messages[index]
                                : undefined,
                          });
                        }}
                        className={`inline hover:underline font-bold focus:outline-none font-mono`}
                        style={{
                          textDecorationColor: messages[index].color,
                          color: messages[index].color,
                        }}
                      >
                        {messages[index].username}
                      </button>
                      <span className={`inline mr-1`}>: </span>
                      <div className={`inline mr-1 space-x-1`}>
                        {messages[index].deleted ? (
                          <span className="inline text-primary-300">
                            [message{" "}
                            {messages[index].deleterId ===
                            messages[index].userId
                              ? "retracted"
                              : "deleted"}
                            ]
                          </span>
                        ) : (
                          messages[index].tokens.map(({ t: token, v }, i) => {
                            switch (token) {
                              case "text":
                                return (
                                  <React.Fragment
                                    key={i}
                                  >{`${v} `}</React.Fragment>
                                );
                              case "emote":
                                return emoteMap[v.toLowerCase()] ? (
                                  <img
                                    key={i}
                                    className="inline"
                                    alt={`:${v}:`}
                                    src={emoteMap[v.toLowerCase()]}
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
                                      className={`inline flex-1 focus:outline-none ${
                                        v === me?.username
                                          ? "bg-accent text-button px-1 rounded text-md"
                                          : ""
                                      }`}
                                      style={{
                                        textDecorationColor:
                                          v === me?.username
                                            ? ""
                                            : messages[index].color,
                                        color:
                                          v === me?.username
                                            ? ""
                                            : messages[index].color,
                                      }}
                                    >
                                      @{v}
                                    </button>{" "}
                                  </React.Fragment>
                                );
                              case "link":
                                try {
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
                                } catch {
                                  return null;
                                }
                              case "block":
                                return (
                                  <React.Fragment key={i}>
                                    <span
                                      className={
                                        "inline bg-primary-600 px-1 rounded whitespace-pre-wrap font-mono"
                                      }
                                    >
                                      {v}
                                    </span>{" "}
                                  </React.Fragment>
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
              </div>
            );
          }
        )}
        {/* {messages.length === 0 ? (
        <div>{t("modules.roomChat.welcomeMessage")}</div>
      ) : null} */}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
