import { useAtom } from "jotai";
import React, { useState } from "react";

import { Avatar } from "../../components/Avatar";
import { ProfileModalFetcher } from "./ProfileModalFetcher";
import { RoomChatMessage, useRoomChatStore } from "./useRoomChatStore";
// @ts-ignore
import normalizeUrl from "normalize-url";
import { meAtom, currentRoomAtom, myCurrentRoomInfoAtom } from "../../atoms";

interface ChatListProps {}

export const RoomChatList: React.FC<ChatListProps> = ({}) => {
  const [profileId, setProfileId] = useState("");
  const messages = useRoomChatStore((s) => s.messages);
  const [me] = useAtom(meAtom);
  const [room] = useAtom(currentRoomAtom);
  const [{ isMod: iAmMod, isCreator: iAmCreator }] = useAtom(
    myCurrentRoomInfoAtom
  );
  const [
    messageToBeDeleted,
    setMessagetobedeleted,
  ] = useState<RoomChatMessage | null>(null);

  return (
    <div
      className={`bg-simple-gray-26 px-8 pt-8 flex-1 overflow-y-auto flex-col-reverse flex`}
    >
      {profileId ? (
        <ProfileModalFetcher
          userId={profileId}
          messageToBeDeleted={messageToBeDeleted}
          onClose={() => {
            setProfileId("");
          }}
        />
      ) : null}
      <div className={`pb-6`} />
      {messages.map((m) => (
        <div className="flex items-center" key={m.id}>
          <div
            className={`py-1 block break-words max-w-full items-start flex-1`}
            key={m.id}
          >
            <span className={`pr-2`}>
              <Avatar size={20} src={m.avatarUrl} className="inline" />
            </span>

            <button
              onClick={() => {
                setProfileId(m.userId);
                setMessagetobedeleted(
                  (me?.id === m.userId ||
                    iAmCreator ||
                    (iAmMod && room?.creatorId !== m.userId)) &&
                    !m.deleted
                    ? m
                    : null
                );
              }}
              className={`hover:underline focus:outline-none`}
              style={{ textDecorationColor: m.color, color: m.color }}
            >
              {m.displayName}
            </button>

            <span className={`mr-1`}>: </span>

            {m.deleted ? (
              <span className="text-gray-500">
                [message {m.deleterId === m.userId ? "retracted" : "deleted"}]
              </span>
            ) : (
              m.tokens.map(({ t, v }, i) => {
                switch (t) {
                  case "text":
                    return (
                      <span className={`flex-1 m-0`} key={i}>
                        {v}
                      </span>
                    );

                  case "mention":
                    return (
                      <button
                        onClick={() => {
                          setProfileId(v);
                        }}
                        key={i}
                        className={`hover:underline flex-1 focus:outline-none ml-1 mr-2 ${
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
                        rel="noreferrer"
                        href={v}
                        className={`flex-1 hover:underline text-blue-500`}
                        key={i}
                      >
                        {normalizeUrl(v, { stripProtocol: true })}{" "}
                      </a>
                    );
                  default:
                    return null;
                }
              })
            )}
          </div>
        </div>
      ))}
      {messages.length === 0 ? <div>Welcome to chat!</div> : null}
    </div>
  );
};
