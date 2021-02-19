import { useAtom } from "jotai";
import React, { useState } from "react";
import { tw } from "twind";
import { Avatar } from "../../components/Avatar";
import { ProfileModalFetcher } from "./ProfileModalFetcher";
import { useRoomChatStore } from "./useRoomChatStore";
import normalizeUrl from "normalize-url";
import { meAtom } from "../../atoms";

interface ChatListProps {}

export const RoomChatList: React.FC<ChatListProps> = ({}) => {
  const [profileId, setProfileId] = useState("");
  const messages = useRoomChatStore((s) => s.messages);
  const [me] = useAtom(meAtom);

  return (
    <div
      className={tw`bg-tmpBg1 px-8 pt-8 flex-1 overflow-y-auto flex-col-reverse flex`}
    >
      {profileId ? (
        <ProfileModalFetcher
          userId={profileId}
          onClose={() => {
            setProfileId("");
          }}
        />
      ) : null}
      <div className={tw`pb-6`} />
      {messages.map((m) => (
        <div
          style={{ wordBreak: "break-word" }}
          className={tw`block py-1`}
          key={m.id}
        >
          <span className={tw`pr-2 inline`}>
            <Avatar style={{ display: "inline" }} size={20} src={m.avatarUrl} />
          </span>

          <button
            onClick={() => {
              setProfileId(m.userId);
            }}
            className={tw`hover:underline focus:outline-none`}
            style={{ textDecorationColor: m.color, color: m.color }}
          >
            {m.displayName}
          </button>

          <span className={tw`mr-1`}>: </span>

          {m.tokens.map(({ t, v }, i) => {
            switch (t) {
              case "text":
                return (
                  <span className={tw`flex-1 m-0`} key={i}>
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
                    className={tw`hover:underline flex-1 focus:outline-none ml-1 mr-2 ${
                      v === me?.username
                        ? "bg-button text-tmpC3 px-2 rounded text-md"
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
                    className={tw`flex-1 hover:underline text-tmpC4`}
                    key={i}
                  >
                    {normalizeUrl(v, { stripProtocol: true })}{" "}
                  </a>
                );
              default:
                return null;
            }
          })}
        </div>
      ))}
      {messages.length === 0 ? <div>Welcome to chat!</div> : null}
    </div>
  );
};
