import router from "next/router";
import React, { HTMLProps } from "react";
import { useAccountOverlay } from "../../../global-stores/useAccountOverlay";
import { useCurrentRoomIdStore } from "../../../global-stores/useCurrentRoomIdStore";
import { SolidMessages, SolidNotification, SolidSearch } from "../../../icons";
import { useTokenStore } from "../../../modules/auth/useTokenStore";
import { closeVoiceConnections } from "../../../modules/webrtc/WebRtcApp";
import { modalConfirm } from "../../../shared-components/ConfirmModal";
import { useConn } from "../../../shared-hooks/useConn";
import { DropdownController } from "../../DropdownController";
import { SettingsDropdown } from "../../SettingsDropdown";
import { SingleUser } from "../../UserAvatar";
import { useTypeSafeTranslation } from "../../../shared-hooks/useTypeSafeTranslation";

export interface ProfileHeaderProps extends HTMLProps<HTMLDivElement> {
  avatar: string;
  onAnnouncementsClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onMessagesClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onSearchClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatar,
  onAnnouncementsClick,
  onMessagesClick,
  onSearchClick,
  className = "",
  ...props
}) => {
  const { set, isOpen } = useAccountOverlay.getState();
  const handleClick = () => {
    if (!isOpen) {
      set({
        isOpen: !isOpen,
      });
    }
  };

  return (
    <div
      className={`flex w-full p-3 h-8 justify-between items-center bg-primary-900 ${className}`}
      {...props}
    >
      <button onClick={handleClick}>
        <SingleUser size="xxs" src={avatar} isOnline={true} />
      </button>
      <div className="flex gap-x-5">
        {onAnnouncementsClick && (
          <button onClick={onAnnouncementsClick}>
            <SolidNotification
              className="text-primary-100"
              height={20}
              width={20}
            />
          </button>
        )}
        {onMessagesClick && (
          <button onClick={onMessagesClick}>
            <SolidMessages
              className="text-primary-100"
              height={20}
              width={20}
            />
          </button>
        )}
        {onSearchClick && (
          <button onClick={onSearchClick}>
            <SolidSearch className="text-primary-100" height={20} width={20} />
          </button>
        )}
      </div>
    </div>
  );
};
