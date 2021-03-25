import { Room } from "@dogehouse/kebab";
import normalizeUrl from "normalize-url";
import React, { useContext, useRef, useState } from "react";
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
  const { setUserId } = useContext(UserPreviewModalContext);
  const messages = useRoomChatStore((s) => s.messages);
  const me = useConn().user;
  const { isMod: iAmMod, isCreator: iAmCreator } = useCurrentRoomInfo();
  const [
    messageToBeDeleted,
    setMessageToBeDeleted,
  ] = useState<RoomChatMessage | null>(null);
  // const bottomRef = useRef<null | HTMLDivElement>(null);
  const chatListRef = useRef<null | HTMLDivElement>(null);
  const {
    isRoomChatScrolledToTop,
    setIsRoomChatScrolledToTop,
  } = useRoomChatStore();
  const { t } = useTypeSafeTranslation();

  // Only scroll into view if not manually scrolled to top
  // useEffect(() => {
  //   isRoomChatScrolledToTop || bottomRef.current?.scrollIntoView();
  // });

  return (
    <div
      className={`px-5 pt-3 flex-1 overflow-y-auto flex-col flex chat-message-container`}
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
        .map((m) => (
          <div className="flex flex-col flex-shrink-0" key={m.id}>
            <div className={`flex items-center px-1`}>
              <div
                className={`py-1 block break-words max-w-full items-start flex-1 text-sm text-primary-100`}
                key={m.id}
              >
                <button
                  onClick={() => {
                    setUserId(m.userId);
                    setMessageToBeDeleted(
                      (me?.id === m.userId ||
                        iAmCreator ||
                        (iAmMod && room.creatorId !== m.userId)) &&
                        !m.deleted
                        ? m
                        : null
                    );
                  }}
                  className={`inline hover:underline font-bold focus:outline-none font-mono`}
                  style={{ textDecorationColor: m.color, color: m.color }}
                >
                  {m.username}
                </button>

                <span className={`inline mr-1`}>: </span>

                {m.deleted ? (
                  <span className="inline">
                    [message{" "}
                    {m.deleterId === m.userId ? "retracted" : "deleted"}]
                  </span>
                ) : (
                  m.tokens.map(({ t: token, v }, i) => {
                    switch (token) {
                      case "text":
                        return (
                          <span className={`flex-1 m-0 inline`} key={i}>
                            {v}{" "}
                          </span>
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
                          <button
                            onClick={() => {
                              setUserId(v);
                            }}
                            key={i}
                            className={`inline hover:underline flex-1 focus:outline-none ml-1 mr-2 ${
                              v === me?.username
                                ? "bg-blue-500 text-white px-2 rounded text-md"
                                : ""
                            }`}
                            style={{
                              textDecorationColor: m.color,
                              color: v === me?.username ? "" : m.color,
                            }}
                          >
                            @{v}{" "}
                          </button>
                        );
                      case "link":
                        return (
                          <a
                            target="_blank"
                            rel="noreferrer noopener"
                            href={v}
                            className={`inline flex-1 hover:underline text-blue-500`}
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
        ))}
      {messages.length === 0 ? (
        <div>{t("modules.roomChat.welcomeMessage")}</div>
      ) : null}
      {/* <div className={`pb-6`} ref={bottomRef} /> */}
      <style>{`
        .chat-message-container > :first-child {
          margin-top: auto;
        }
      `}</style>
    </div>
  );
};
