import { UserWithFollowInfo } from "@dogehouse/kebab";
import Link from "next/link";
import React, { MouseEventHandler } from "react";
import { ApiPreloadLink } from "../shared-components/ApiPreloadLink";
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

export const FollowerOnline: React.FC<UserWithFollowInfo> = ({
  username,
  avatarUrl: avatar,
  online,
  currentRoom,
}) => (
  <div className="py-3 w-full">
    <ApiPreloadLink route="profile" data={{ username }}>
      <SingleUser
        size="sm"
        isOnline={online}
        src={avatar}
        username={username}
      />
    </ApiPreloadLink>
    <div className="ml-3 flex flex-col">
      <ApiPreloadLink route="profile" data={{ username }}>
        <h5 className="text-primary-100 font-bold">{username}</h5>
      </ApiPreloadLink>
      <Link
        href={`/room/[id]`}
        as={currentRoom ? `/room/${currentRoom.id}` : undefined}
      >
        <a className={`text-primary-300 border-b`}>{currentRoom?.name}</a>
      </Link>
    </div>
  </div>
);

export const FollowersOnlineWrapper: React.FC<{
  onlineFriendCount?: number;
}> = ({ onlineFriendCount, children }) => {
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
      <div className="flex flex-col mt-3 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export const FollowersOnlineShowMore: React.FC<{ onClick?: () => void }> = ({
  onClick,
}) => {
  return (
    <button
      className="underline text-primary-300 font-bold mt-4 cursor-pointer"
      onClick={onClick}
      data-testid="show-more-btn"
    >
      Show more
    </button>
  );
};
