import React from "react";
import { GenericNotification } from "./GenericNotification";
import { Button } from "../Button";
import { LgSolidTime } from "../../icons";

export interface LiveNotificationProps {
  username: string;
  userProfileLink?: string;
  time: string;
  joined?: boolean;
}

export const LiveNotification: React.FC<LiveNotificationProps> = ({
  username,
  userProfileLink,
  time,
  joined = false,
}) => {
  const icon = <LgSolidTime className="text-primary-300" />;

  const notificationMsg = (
    <>
      <a
        className="font-bold"
        {...(userProfileLink ? { href: userProfileLink } : {})}
      >
        {username}
      </a>
      <span>&nbsp;is now live!</span>
    </>
  );

  const followButton = (
    <Button
      size="small"
      color={joined ? "secondary" : "primary"}
      style={{ width: "90px" }}
    >
      {joined ? "Joined" : "Join room"}
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
