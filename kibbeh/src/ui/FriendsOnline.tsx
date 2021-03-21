import React, { MouseEventHandler } from "react";
import { SingleUser } from "./UserAvatar/SingleUser";

export interface FriendOnlineType {
  username: string;
  avatar: string;
  isOnline: boolean;
  activeRoom?: {
    name: string;
    link?: string;
  };
}

export interface FriendsOnlineProps {
  onlineFriendList: FriendOnlineType[];
  onlineFriendCount: number;
  showMoreAction?: MouseEventHandler<HTMLDivElement>;
}

const FriendOnline: React.FC<FriendOnlineType> = ({
  username,
  avatar,
  isOnline,
  activeRoom,
}) => (
  <div className="py-3 w-full">
    <SingleUser size="sm" isOnline={isOnline} src={avatar} />
    <div className="ml-3 flex flex-col">
      <h5 className="text-primary-100 font-bold">{username}</h5>
      <a
        className={`text-primary-300 border-b`}
        {...(activeRoom?.link ? { href: activeRoom.link } : {})}
      >
        {activeRoom?.name}
      </a>
    </div>
  </div>
);

export const FriendsOnline: React.FC<FriendsOnlineProps> = ({
  onlineFriendList = [],
  onlineFriendCount = 0,
  showMoreAction,
}) => {
  return (
    <div className="pb-5 w-full flex flex-col" data-testid="friends-online">
      <h4 className="text-primary-100">People</h4>
      <h6 className="text-primary-300 mt-3 text-sm font-bold">
        ONLINE ({onlineFriendCount})
      </h6>
      <div className="flex flex-col mt-3">
        {onlineFriendList.length > 0 ? (
          <>
            {onlineFriendList.map((friend, idx) => (
              <FriendOnline key={idx} {...friend} />
            ))}
            <div
              className="underline text-primary-300 font-bold mt-4 cursor-pointer"
              onClick={showMoreAction}
              data-testid="show-more-btn"
            >
              Show more
            </div>
          </>
        ) : (
          <p className="text-primary-200" data-testid="placeholder">
            You have 0 friends online right now
          </p>
        )}
      </div>
    </div>
  );
};
