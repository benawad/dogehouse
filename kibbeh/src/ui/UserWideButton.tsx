import React, { useState } from "react";
import { SingleUser } from "./UserAvatar";
import { Button } from "./Button";
import { BaseUser } from "@dogehouse/kebab";

export interface UserWideButtonInfoProps {
  userStatus(): string , 
  user: BaseUser
}


export const UserWideButton: React.FC<UserWideButtonInfoProps> = ({ userStatus, user }) => {
  const [buttonText, setButtonText] = useState(userStatus());

  
  return (
    <>
      <div className="flex flex-row bg-primary-800 items-center p-6 rounded-8 w-full">
        <div className="flex">
          <SingleUser size="av" src={user.avatarUrl} username={user.username} />
        </div>
        <div className="flex flex-col ml-1">
          <span
            className="flex font-bold text-base text-primary-100 break-all h-full line-clamp-1 truncate"
          >
            {user.displayName}
          </span>
          <span className="flex text-base h-full text-primary-300">
            @{user.username}
          </span>
        </div>
        <div className="flex mt-2 mb-2 pl-4">
          <Button
            size="small"
            className="flex"
            onClick={() => {
                userStatus();
              }}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </>
  );
};
