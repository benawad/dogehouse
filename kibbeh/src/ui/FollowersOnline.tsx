import { UserWithFollowInfo } from "@dogehouse/kebab";
import Link from "next/link";
import React, { MouseEventHandler } from "react";
import { SingleUser } from "./UserAvatar/SingleUser";

export interface FriendOnlineType {
  username: string;
  avatarUrl: string;
  isOnline: boolean;
  activeRoom?: {
    name: string;
    link?: string;
  };
}

export interface FriendsOnlineProps {
  onlineFriendList: UserWithFollowInfo[];
  onlineFriendCount?: number;
  showMoreAction?: MouseEventHandler<HTMLDivElement>;
}

const FriendOnline: React.FC<UserWithFollowInfo> = ({
  username,
  avatarUrl: avatar,
  online,
  currentRoom,
}) => (
  <div className="py-3 w-full">
    <SingleUser size="sm" isOnline={online} src={avatar} />
    <div className="ml-3 flex flex-col">
      <h5 className="text-primary-100 font-bold">{username}</h5>
      <Link
        href={`/room/[id]`}
        as={currentRoom ? `/room/${currentRoom.id}` : undefined}
      >
        <a className={`text-primary-300 border-b`}>{currentRoom?.name}</a>
      </Link>
    </div>
  </div>
);

export const FollowersOnline: React.FC<FriendsOnlineProps> = ({
  onlineFriendList = [],
  onlineFriendCount,
  showMoreAction,
}) => {
  return (
    <div
      className="pb-5 w-full flex flex-col flex-1 overflow-y-auto"
      data-testid="friends-online"
    >
      <h4 className="text-primary-100">People</h4>
      <h6 className="text-primary-300 mt-3 text-sm font-bold">
        ONLINE{" "}
        {onlineFriendCount !== undefined ? `(${onlineFriendCount})` : null}
      </h6>
      <div className="flex flex-col mt-3 overflow-y-auto">
        {onlineFriendList.length > 0 ? (
          <>
            {onlineFriendList.map((friend, idx) => (
              <FriendOnline key={idx} {...friend} />
            ))}
          </>
        ) : (
          <p className="text-primary-200" data-testid="placeholder">
            You have 0 friends online right now
          </p>
        )}
      </div>
      <div
        className="underline text-primary-300 font-bold mt-4 cursor-pointer"
        onClick={showMoreAction}
        data-testid="show-more-btn"
      >
        Show more
      </div>
    </div>
  );
};
