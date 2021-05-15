import { Message, Room, RoomUser } from "@dogehouse/kebab";
import normalizeUrl from "normalize-url";
import React, { useContext, useEffect, useRef } from "react";
import { useVirtual, VirtualItem } from "react-virtual";
import { useConn } from "../../../shared-hooks/useConn";
import { useCurrentRoomInfo } from "../../../shared-hooks/useCurrentRoomInfo";
import { useTypeSafeTranslation } from "../../../shared-hooks/useTypeSafeTranslation";
import { ParseTextToTwemoji, StaticTwemoji } from "../../../ui/Twemoji";
import { UserPreviewModalContext } from "../UserPreviewModalProvider";
import { Emote } from "./Emote";
import { EmoteKeys } from "./EmoteData";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { useRoomChatStore } from "./useRoomChatStore";
import { useResize } from "../useResize";

interface ChatListProps {
  room: Room;
  userMap: Record<string, RoomUser>;
}

interface BadgeIconData {
  emoji: string;
  title: string;
}

export const RoomChatList: React.FC<ChatListProps> = ({ room, userMap }) => {
  const { setData } = useContext(UserPreviewModalContext);
  const { messages, toggleFrozen } = useRoomChatStore();
  const me = useConn().user;
  const { isMod: iAmMod, isCreator: iAmCreator } = useCurrentRoomInfo();
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const chatListRef = useRef<null | HTMLDivElement>(null);
  const {
    isRoomChatScrolledToTop,
    setIsRoomChatScrolledToTop,
    message,
    setMessage,
  } = useRoomChatStore();
  const { t } = useTypeSafeTranslation();

  // Only scroll into view if not manually scrolled to top
  useEffect(() => {
    if (!isRoomChatScrolledToTop) {
      chatListRef.current?.scrollTo(0, chatListRef.current.scrollHeight);
    }
  });
  const windowSize = useResize();
  const rowVirtualizer = useVirtual({
    overscan: 10,
    size: messages.length,
    parentRef: chatListRef,
    estimateSize: React.useCallback(() => windowSize.y * 0.2, [windowSize]),
  });

  const getBadgeIcon = (m: Message) => {
    const user = userMap[m.userId];
    const isCreator = room.creatorId === user?.id;
    let badge: React.ReactNode | null = null;
    if (isCreator) {
      badge = (
        <Emote title="Admin" alt="admin" size="small" emote="coolhouse" />
      );
    } else if (user?.roomPermissions?.isMod) {
      badge = <Emote title="Mod" alt="mod" size="small" emote="dogehouse" />;
    } else if (user?.roomPermissions?.isSpeaker) {
      badge = <StaticTwemoji emoji="📣" title="Speaker" />;
    }
    return <span style={{ marginRight: 4 }}>{badge}</span>;
  };

  return (
    <div
      className={`flex px-5 flex-1 overflow-y-auto chat-message-container scrollbar-thin scrollbar-thumb-primary-700`}
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
      onMouseEnter={toggleFrozen}
      onMouseLeave={toggleFrozen}
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
            const badgeIcon = getBadgeIcon(messages[index]);
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
                    <div className="flex mb-1 text-sm text-primary-300 px-1 w-16 mt-1 text-center">
                      {t("modules.roomChat.whisper")}
                    </div>
                  ) : null}
                  <div className={`flex items-center px-1`}>
                    <div
                      className={`block break-words overflow-hidden max-w-full items-start flex-1 text-primary-100`}
                      key={messages[index].id}
                    >
                      {badgeIcon}
                      <button
                        onClick={(e) => {
                          // Auto mention on shift click
                          if (e.shiftKey && messages[index].userId !== me.id) {
                            setMessage(
                              message +
                                "@" +
                                messages[index].username
                            );
                            document.getElementById("room-chat-input")?.focus();

                            return;
                          }

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
                        // DO NOT CHANGE FONT ON THIS BUTTON, IT CRASHES FIREFOX
                        className={`inline hover:underline font-bold focus:outline-none`}
                        style={{
                          textDecorationColor: messages[index].color,
                          color: messages[index].color,
                        }}
                      >
                        {messages[index].username}
                      </button>
                      <span className={`inline`}>: </span>
                      <div className={`inline`}>
                        {messages[index].deleted ? (
                          <span className="inline text-primary-300 italic">
                            {t("modules.roomChat.messageDeletion.message") + ""}
                            {messages[index].deleterId ===
                            messages[index].userId
                              ? t("modules.roomChat.messageDeletion.retracted")
                              : t("modules.roomChat.messageDeletion.deleted")}
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
                                return <Emote emote={v as EmoteKeys} key={i} />;

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
                                    </button>
                                    {""}
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
                                      {normalizeUrl(v, { stripProtocol: true })}
                                      {""}
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
                                    </span>
                                    {""}
                                  </React.Fragment>
                                );
                              case "emoji":
                                return <>
                                <ParseTextToTwemoji text={v}></ParseTextToTwemoji>
                                </>;
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
        <div className="flex">{t("modules.roomChat.welcomeMessage")}</div>
      ) : null} */}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
