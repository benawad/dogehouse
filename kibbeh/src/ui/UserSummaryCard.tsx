import React from "react";

import { SingleUser } from "./UserAvatar";
import { UserBadge } from "./UserBadge";
import { kFormatter } from "../lib/kFormatter";
import { ApiPreloadLink } from "../shared-components/ApiPreloadLink";

type badge = {
  content: React.ReactNode;
  variant: "primary" | "secondary";
};

export interface UserSummaryCardProps {
  onClick: () => void;
  id: string;
  displayName: string;
  username: string;
  numFollowers: number;
  numFollowing: number;
  isOnline: boolean;
  avatarUrl: string;
  badges: badge[];
  bio?: string;
  website?: string;
}

interface BadgesProps {
  badges: badge[];
}

interface WebsiteProps {
  website: string;
}

export const Badges: React.FC<BadgesProps> = ({ badges }) => {
  return (
    <div className="mt-2">
      {badges.map(({ content, variant }, i) => (
        <span className="mr-1" key={i}>
          <UserBadge variant={variant}>{content}</UserBadge>
        </span>
      ))}
    </div>
  );
};

const regex = /(^\w+:|^)\/\//;

export const Website: React.FC<WebsiteProps> = ({ website }) => {
  return (
    <a
      className="text-accent mt-3 font-bold"
      href={website}
      target="_blank"
      rel="noreferrer"
    >
      {website.replace(regex, "")}
    </a>
  );
};

export const UserSummaryCard: React.FC<UserSummaryCardProps> = ({
  onClick,
  displayName,
  username,
  badges,
  numFollowers,
  numFollowing,
  bio,
  website,
  isOnline,
  avatarUrl,
}) => {
  return (
    <div className="flex-col rounded-8 bg-primary-800 p-4 w-full">
      <button onClick={onClick}>
        <div>
          <SingleUser size="default" isOnline={isOnline} src={avatarUrl} />
        </div>
        <div>
          <div className="flex-col ml-3">
            <span className="text-sm text-primary-100 font-bold break-all text-left">
              {displayName}
            </span>
            <span className="text-sm text-primary-300 text-left break-all">
              @{username}
            </span>
            <Badges badges={badges} />
          </div>
        </div>
      </button>
      <div className="mt-3">
        <div>
          <ApiPreloadLink route="followers" data={{ username }}>
            <span className="text-primary-100 font-bold">
              {kFormatter(numFollowers)}
            </span>{" "}
            <span className="text-primary-300 ml-1">followers</span>
          </ApiPreloadLink>
        </div>
        <div className="ml-4">
          <ApiPreloadLink route="following" data={{ username }}>
            <span className="text-primary-100 font-bold">
              {kFormatter(numFollowing)}
            </span>
            <span className="text-primary-300 ml-1"> following</span>
          </ApiPreloadLink>
        </div>
      </div>
      <div className="text-primary-300 mt-3 break-words text-left">{bio}</div>
      {website && <Website website={website} />}
    </div>
  );
};
