import React from "react";
import { formatDistance, fromUnixTime } from "date-fns";

import { SingleUser } from "./UserAvatar";

export interface MessageElementProps {
  user: {
    username: string;
    avatar: string;
    isOnline: boolean;
  };
  msg: {
    ts: number;
    text: string;
  };
}

interface MessageDateProps {
  ts: number;
}

const MessageDate: React.FC<MessageDateProps> = ({ ts }) => (
  <span
    className="text-primary-300 text-sm font-medium inline-block truncate"
    style={{
      lineHeight: "22px",
    }}
  >
    {formatDistance(fromUnixTime(ts), new Date())} ago
  </span>
);

export const MessageElement: React.FC<MessageElementProps> = ({
  user,
  msg,
}) => {
  return (
    <div
      className="items-center w-full px-4 md:bg-primary-800 md:border-b md:border-primary-600 cursor-pointer hover:bg-primary-700 bg-primary-900"
      data-testid="msg-element"
    >
      <div className="flex mr-3">
        <SingleUser size="sm" isOnline={user.isOnline} src={user.avatar} />
      </div>
      <div
        className="flex-col py-3 border-b border-primary-600 md:border-none md:py-0"
        style={{
          width: "calc(100% - 50px)",
        }}
      >
        <div className="flex justify-between">
          <span
            className="text-button font-bold inline-block truncate mr-1"
            style={{
              lineHeight: "22px",
            }}
          >
            {user.username}
          </span>
          <MessageDate ts={msg.ts} />
        </div>
        <div
          className="block text-sm text-primary-300 font-medium truncate w-9/12"
          style={{
            lineHeight: "22px",
          }}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
};
