import React from "react";
import { SearchBar } from "./Search/SearchBar";
import {
  SolidMegaphone,
  SolidMessages,
  SolidNotification,
  LgLogo,
} from "../icons";
import { SingleUser } from "./UserAvatar";
import { DashboardInnerGrid } from "./DashboardGrid";

export interface HeaderProps {
  searchPlaceholder: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => null;
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

const Header: React.FC<HeaderProps> = ({
  searchPlaceholder,
  onSearchChange,
  avatarImg,
  onAnnouncementsClick,
  onMessagesClick,
  onNotificationsClick,
  actionButton,
}) => {
  return (
    <DashboardInnerGrid>
      <LgLogo />
      <div className="flex-1 justify-center">
        <div style={{ width: 640 }}>
          <SearchBar
            placeholder={searchPlaceholder}
            onChange={onSearchChange}
          />
        </div>
      </div>
      <div className="space-x-4 items-center justify-end">
        {onAnnouncementsClick && (
          <button onClick={onAnnouncementsClick}>
            <SolidMegaphone
              width={23}
              height={23}
              className="text-primary-200"
            />
          </button>
        )}
        {onMessagesClick && (
          <button onClick={onMessagesClick}>
            <SolidMessages
              width={23}
              height={23}
              className="text-primary-200"
            />
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
    </DashboardInnerGrid>
  );
};

export default Header;
