import React from "react";
import { SearchBar } from "./Search/SearchBar";
import {
  SmSolidMegaphone,
  SmSolidMessages,
  SmSolidNotification,
  LgLogo,
} from "../icons";
import { Button } from "./Button";
import { SingleUser } from "./UserAvatar";

export interface HeaderProps {
  searchPlaceholder: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => null;
  onAnnouncementsClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => null;
  onMessagesClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => null;
  onNotificationsClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => null;
  actionButtonIcon: React.ReactNode;
  actionButtonLabel: string;
  onActionButtonClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => null;
  avatarImg: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <div className="flex-1 items-center">
      <LgLogo />
      <div className="flex-1 justify-center mx-3">
        <div style={{ width: 640 }}>
          <SearchBar
            placeholder={props.searchPlaceholder}
            onChange={props.onSearchChange}
          />
        </div>
      </div>
      <div className="space-x-4 items-center">
        <button onClick={props.onAnnouncementsClick}>
          <SmSolidMegaphone
            width={23}
            height={23}
            className="text-primary-200"
          />
        </button>
        <button onClick={props.onMessagesClick}>
          <SmSolidMessages
            width={23}
            height={23}
            className="text-primary-200"
          />
        </button>
        <button onClick={props.onNotificationsClick}>
          <SmSolidNotification
            width={23}
            height={23}
            className="text-primary-200"
          />
        </button>
        <Button icon={props.actionButtonIcon}>{props.actionButtonLabel}</Button>
        <SingleUser size="sm" src={props.avatarImg} />
      </div>
    </div>
  );
};

export default Header;
