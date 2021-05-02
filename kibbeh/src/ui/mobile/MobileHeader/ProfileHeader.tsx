import router from "next/router";
import React, { HTMLProps } from "react";
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
  const conn = useConn();
  const { t } = useTypeSafeTranslation();
  return (
    <div
      className={`flex w-full p-3 h-8 flex justify-between items-center bg-primary-900 ${className}`}
      {...props}
    >
      <DropdownController
        zIndex={20}
        className="top-2 left-4 md:right-0 fixed"
        innerClassName="fixed transform"
        overlay={(close) => (
          <SettingsDropdown
            onActionButtonClicked={() => {
              modalConfirm(
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                t("components.settingsDropdown.logOut.modalSubtitle"),
                () => {
                  conn.close();
                  closeVoiceConnections(null);
                  useCurrentRoomIdStore.getState().setCurrentRoomId(null);
                  useTokenStore
                    .getState()
                    .setTokens({ accessToken: "", refreshToken: "" });
                  router.push("/logout");
                }
              );
            }}
            onCloseDropdown={close}
            user={conn.user}
          />
        )}
      >
        <SingleUser size="xxs" src={avatar} isOnline={true} />
      </DropdownController>
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
