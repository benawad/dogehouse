import React from "react";
import { SingleUser } from "./UserAvatar";
import { Button } from "./Button";
import { BaseUser } from "@dogehouse/kebab";

export interface UserWideButtonInfoProps {
  user: BaseUser;
  unblock: () => void;
}

export const UserWideButton: React.FC<UserWideButtonInfoProps> = ({
  user,
  unblock,
}) => {
  return (
    <>
      <div className="flex items-center justify-between px-4 w-full">
        <div className="flex">
          <SingleUser size="sm" src={user.avatarUrl} username={user.username} />
          <div className="flex flex-col ml-2">
            <span className="font-bold text-primary-100 whitespace-nowrap">
              {user.displayName}
            </span>
            <span className="text-primary-300 text-sm whitespace-nowrap">
              @{user.username}
            </span>
          </div>
        </div>
        <Button size="small" onClick={unblock}>
          Unblock
        </Button>
      </div>
    </>
  );
};
