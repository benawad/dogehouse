import React, { useState } from "react";
import { tw } from "twind";
import { Avatar } from "../../components/Avatar";
import { ProfileModalFetcher } from "./ProfileModalFetcher";
import { useRoomChatStore } from "./useRoomChatStore";

interface ChatListProps {}

export const RoomChatList: React.FC<ChatListProps> = ({}) => {
  const [profileId, setProfileId] = useState("");
  const messages = useRoomChatStore(s => s.messages);
  return (
    <div
      className={tw`bg-tmpBg1 px-8 pt-8 flex-1 overflow-y-auto flex-col-reverse flex`}
    >
      {profileId ? (
        <ProfileModalFetcher
          userId={profileId}
          onClose={() => setProfileId("")}
        />
      ) : null}
      <div className={tw`pb-6`} />
      {messages.map(m => (
        <div
          style={{ wordBreak: "break-word" }}
          className={tw`block py-1`}
          key={m.id}
        >
          <span className={tw`pr-2 inline`}>
            <Avatar style={{ display: "inline" }} size={20} src={m.avatarUrl} />
          </span>{" "}
          <button
            onClick={() => setProfileId(m.userId)}
            className={tw`hover:underline`}
            style={{ textDecorationColor: m.color, color: m.color }}
          >
            {m.displayName}
          </button>
          <span className={tw`mr-1`}>: </span>
          {m.tokens.map(({ t, v }, i) =>
            t === "text" ? (
              <span className={tw`flex-1`} key={i}>
                {v}
              </span>
            ) : null
          )}
        </div>
      ))}
      {messages.length === 0 ? <div>Welcome to chat!</div> : null}
    </div>
  );
};
