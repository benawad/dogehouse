import React from "react";

import { SingleUser } from "./UserAvatar";
import { UserBadge } from "./UserBadge";
import { kFormatter } from "../lib/kFormatter";

type badge = {
  content: any;
  variant: "primary" | "secondary";
  type: "text" | "svg";
};

export interface UserSummaryCardProps {
  userId: string;
  displayName: string;
  username: string;
  followers: number;
  following: number;
  isOnline: boolean;
  avatar: string;
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
      {badges.map(({ content, variant, type }, i) => (
        <span className="mr-1" key={i}>
          <UserBadge variant={variant}>
            {type === "svg" ? content() : content}
          </UserBadge>
        </span>
      ))}
    </div>
  );
};

export const Website: React.FC<WebsiteProps> = ({ website }) => {
  return (
    <a
      className="text-accent mt-3 font-bold"
      href={website}
      target="_blank"
      rel="noreferrer"
    >
      {website.replace(/(^\w+:|^)\/\//, "")}
    </a>
  );
};

export const UserSummaryCard: React.FC<UserSummaryCardProps> = ({
  userId,
  displayName,
  username,
  badges,
  followers,
  following,
  bio,
  website,
  isOnline,
  avatar,
}) => {
  return (
    <div
      className="flex-col bg-primary-800 p-4 w-full"
      style={{ borderRadius: "8px" }}
    >
      <div>
        <SingleUser size="default" isOnline={isOnline} src={avatar} />
        <div className="flex-col ml-3">
          <span className="text-sm text-primary-100 font-bold">
            {displayName}
          </span>
          <span className="text-sm text-primary-300">{username}</span>
          <Badges badges={badges} />
        </div>
      </div>
      <div className="mt-3">
        <div>
          <span className="text-primary-100 font-bold">
            {kFormatter(followers)}
          </span>{" "}
          <span className="text-primary-300 ml-1">followers</span>
        </div>
        <div className="ml-4">
          <span className="text-primary-100 font-bold">
            {kFormatter(following)}
          </span>
          <span className="text-primary-300 ml-1"> following</span>
        </div>
      </div>
      <div className="text-primary-300 mt-3">{bio}</div>
      {website && <Website website={website} />}
    </div>
  );
};
