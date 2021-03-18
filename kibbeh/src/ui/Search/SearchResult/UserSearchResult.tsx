import React from "react";
import { SingleUser } from "../../UserAvatar";

export interface UserSearchResultProps {
  user: {
    id: string;
    username: string;
    displayName: string;
    isOnline: boolean;
    avatar: string;
  };
}

export const UserSearchResult: React.FC<UserSearchResultProps> = ({ user }) => {
  return (
    <div className="cursor-pointer hover:bg-primary-700 px-4 py-3 w-full">
      <div className="mr-3">
        <SingleUser isOnline={user.isOnline} src={user.avatar} size="sm" />
      </div>
      <div className="flex-col">
        <span
          className="text-primary-100 font-bold"
          style={{ lineHeight: "22px" }}
        >
          {user.displayName}
        </span>
        <span className="text-primary-300 text-sm">{user.username}</span>
      </div>
    </div>
  );
};
