import { Room } from "@dogehouse/kebab";
import normalizeUrl from "normalize-url";
import React, { useContext, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
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
  const { messages, toggleFrozen } = useRoomChatStore();
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
  // useEffect(() => {
  //   if (!isRoomChatScrolledToTop) {
  //     chatListRef.current?.scrollTo(0, chatListRef.current.scrollHeight);
  //   }
  // });

  const atBottomStateChange = (atBottom: boolean) => {
    setIsRoomChatScrolledToTop(!atBottom);
    if (atBottom) {
      useRoomChatMentionStore.getState().resetIAmMentioned();
    }
  };

  return (
    <div
      className={`flex flex-1 pl-5 overflow-y-auto chat-message-container scrollbar-thin scrollbar-thumb-primary-700`}
      ref={chatListRef}
    >
      <div
        className="w-full"
        onMouseEnter={toggleFrozen}
        onMouseLeave={toggleFrozen}
      >
        <Virtuoso
          overscan={10}
          data={messages}
          alignToBottom={true}
          followOutput={"auto"}
          style={{ height: "100%" }}
          atBottomStateChange={atBottomStateChange}
          itemContent={(_, message) => (
            <div className="py-1 mr-4">
              <div
                className={`flex flex-col flex-shrink-0 w-full ${
                  message.isWhisper ? "bg-primary-700 rounded p-1 pt-0" : ""
                }`}
              >
                {/* Whisper label */}
                {message.isWhisper ? (
                  <p className="flex mb-0 text-sm text-primary-300 px-1 w-16 mt-1 text-center">
                    {t("modules.roomChat.whisper")}
                  </p>
                ) : null}
                <div className={`flex items-center px-1`}>
                  <div
                    className={`block break-words overflow-hidden max-w-full items-start flex-1 text-primary-100`}
                    key={message.id}
                  >
                    <button
                      onClick={() => {
                        setData({
                          userId: message.userId,
                          message:
                            (me?.id === message.userId ||
                              iAmCreator ||
                              (iAmMod && room.creatorId !== message.userId)) &&
                            !message.deleted
                              ? message
                              : undefined,
                        });
                      }}
                      className={`inline hover:underline font-bold focus:outline-none font-mono`}
                      style={{
                        textDecorationColor: message.color,
                        color: message.color,
                      }}
                    >
                      {message.username}
                    </button>
                    <span className={`inline mr-1`}>: </span>
                    <div className={`inline mr-1 space-x-1`}>
                      {message.deleted ? (
                        <span className="inline text-primary-300">
                          [message{" "}
                          {message.deleterId === message.userId
                            ? "retracted"
                            : "deleted"}
                          ]
                        </span>
                      ) : (
                        message.tokens.map(({ t: token, v }, i) => {
                          switch (token) {
                            case "text":
                              return (
                                <React.Fragment
                                  key={i}
                                >{`${v} `}</React.Fragment>
                              );
                            case "emote":
                              return emoteMap[v.toLowerCase()] ? (
                                <React.Fragment key={i}>
                                  <img
                                    className="inline"
                                    alt={`:${v}:`}
                                    src={emoteMap[v.toLowerCase()]}
                                  />{" "}
                                </React.Fragment>
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
                                        v === me?.username ? "" : message.color,
                                      color:
                                        v === me?.username ? "" : message.color,
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
                                    {normalizeUrl(v, {
                                      stripProtocol: true,
                                    })}{" "}
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
          )}
        />

        {/* {rowVirtualizer.virtualItems.map(
          ({ index: idx, start, measureRef, size }: VirtualItem) => {
            const index = messages.length - idx - 1;

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
