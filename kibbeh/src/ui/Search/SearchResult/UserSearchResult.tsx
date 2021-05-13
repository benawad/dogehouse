import { User } from "@dogehouse/kebab";
import React from "react";
import { SingleUser } from "../../UserAvatar";

export interface UserSearchResultProps {
  user: User;
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
        <SingleUser isOnline={user.online} src={user.avatarUrl} size="md" />
      </div>
      <div className="flex flex-col">
        <span className="text-primary-100 font-bold">{user.displayName}</span>
        <span className="text-primary-300">@{user.username}</span>
      </div>
    </div>
  );
};
