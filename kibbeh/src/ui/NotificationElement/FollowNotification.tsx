import React from "react";
import { GenericNotification } from "./GenericNotification";
import { SingleUser } from "../UserAvatar/SingleUser";
import { Button } from "../Button";

export interface FollowNotificationProps {
  userAvatarSrc: string;
  username: string;
  userProfileLink?: string;
  time: string;
  isOnline?: boolean;
  followed?: boolean;
}

export const FollowNotification: React.FC<FollowNotificationProps> = ({
  userAvatarSrc,
  isOnline = false,
  username,
  userProfileLink,
  time,
  followed = false,
}) => {
  const icon = <SingleUser src={userAvatarSrc} size="sm" isOnline={isOnline} />;

  const notificationMsg = (
    <>
      <a
        className="font-bold"
        {...(userProfileLink ? { href: userProfileLink } : {})}
      >
        {username}&nbsp;
      </a>
      <span>followed you</span>
    </>
  );

  const followButton = (
    <Button
      size="small"
      color={followed ? "secondary" : "primary"}
      style={{ width: "90px" }}
    >
      {followed ? "Followed" : "Follow back"}
    </Button>
  );

  return (
    <GenericNotification
      icon={icon}
      notificationMsg={notificationMsg}
      time={time}
      actionButton={followButton}
    />
  );
};
