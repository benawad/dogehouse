import { User } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import React from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { SolidMegaphone, SolidMessages, SolidNotification } from "../../icons";
import { useTokenStore } from "../../modules/auth/useTokenStore";
import { closeVoiceConnections } from "../../modules/webrtc/WebRtcApp";
import { modalConfirm } from "../../shared-components/ConfirmModal";
import { useConn } from "../../shared-hooks/useConn";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { DropdownController } from "../DropdownController";
import { SettingsDropdown } from "../SettingsDropdown";
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
}

const RightHeader: React.FC<RightHeaderProps> = ({
  actionButton,
  onAnnouncementsClick,
  onMessagesClick,
  onNotificationsClick,
}) => {
  const conn = useConn();
  const { push } = useRouter();
  const { t } = useTypeSafeTranslation();

  if (!conn) {
    return <div />;
  }

  return (
    <div className="flex space-x-4 items-center justify-end focus:outline-no-chrome w-full">
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
      <DropdownController
        zIndex={20}
        className="top-9 right-3 md:right-0 fixed"
        innerClassName="fixed  transform -translate-x-full"
        overlay={(close) => (
          <SettingsDropdown
            onActionButtonClicked={() => {
              modalConfirm(
                t("components.settingsDropdown.logOut.modalSubtitle"),
                () => {
                  conn.close();
                  closeVoiceConnections(null);
                  useCurrentRoomIdStore.getState().setCurrentRoomId(null);
                  useTokenStore
                    .getState()
                    .setTokens({ accessToken: "", refreshToken: "" });
                  push("/logout");
                }
              );
            }}
            onCloseDropdown={close}
            user={conn.user}
          />
        )}
      >
        <SingleUser
          className={"focus:outline-no-chrome"}
          size="sm"
          src={conn.user.avatarUrl}
        />
      </DropdownController>
    </div>
  );
};

export default RightHeader;
