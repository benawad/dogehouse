import React from "react";
import { SolidMegaphone, SolidMessages, SolidNotification } from "../../icons";
import { SingleUser } from "../UserAvatar";

export interface RightHeaderProps {
  onAnnouncementsClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => null;
  onMessagesClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => null;
  onNotificationsClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => null;
  actionButton?: React.ReactNode;
  avatarImg: string;
}

export const RightHeader: React.FC<RightHeaderProps> = ({
  avatarImg,
  actionButton,
  onAnnouncementsClick,
  onMessagesClick,
  onNotificationsClick,
}) => {
  return (
    <div className="space-x-4 items-center justify-end">
      {onAnnouncementsClick && (
        <button onClick={onAnnouncementsClick}>
          <SolidMegaphone width={23} height={23} className="text-primary-200" />
        </button>
      )}
      {onMessagesClick && (
        <button onClick={onMessagesClick}>
          <SolidMessages width={23} height={23} className="text-primary-200" />
        </button>
      )}
      {onNotificationsClick && (
        <button onClick={onNotificationsClick}>
          <SolidNotification
            width={23}
            height={23}
            className="text-primary-200"
          />
        </button>
      )}
      {actionButton}
      <SingleUser size="sm" src={avatarImg} />
    </div>
  );
};
