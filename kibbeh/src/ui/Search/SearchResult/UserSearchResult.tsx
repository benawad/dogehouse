import router from "next/router";
import React from "react";
import { SingleUser } from "../../UserAvatar";

export interface UserSearchResultProps {
  user: {
    username: string;
    displayName: string;
    isOnline: boolean;
    avatar: string;
  };
  className?: string;
  onClick?: () => void;
}

export const UserSearchResult: React.FC<UserSearchResultProps> = ({
  user,
  className = "",
  onClick = () => undefined,
}) => {
  return (
    <div
      className={`flex cursor-pointer hover:bg-primary-700 px-4 py-3 w-full rounded-8 ${className}`}
      onClick={onClick}
    >
      <div className="flex mr-3">
        <SingleUser isOnline={user.isOnline} src={user.avatar} size="md" />
      </div>
      <div className="flex flex-col">
        <span className="text-primary-100 font-bold">{user.displayName}</span>
        <span className="text-primary-300">@{user.username}</span>
      </div>
    </div>
  );
};
