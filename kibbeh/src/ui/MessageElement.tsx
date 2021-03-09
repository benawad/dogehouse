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
    className="text-primary-300 font-medium inline-block truncate"
    style={{
      fontSize: "12px",
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
      className="items-center px-4 py-3 bg-primary-800 border-b border-primary-600"
      style={{
        maxWidth: "440px",
        width: "100%",
      }}
    >
      <div className="mr-2">
        <SingleUser size="sm" isOnline={user.isOnline} src={user.avatar} />
      </div>
      <div
        className="flex-col"
        style={{
          width: "calc(100% - 50px)",
        }}
      >
        <div className="justify-between">
          <span
            className="text-button font-medium inline-block truncate mr-1"
            style={{
              fontSize: "14px",
              lineHeight: "22px",
            }}
          >
            {user.username}
          </span>
          <MessageDate ts={msg.ts} />
        </div>
        <div
          className="block text-primary-300 font-medium truncate"
          style={{
            fontSize: "12px",
            lineHeight: "22px",
            maxWidth: "248px",
          }}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
};
