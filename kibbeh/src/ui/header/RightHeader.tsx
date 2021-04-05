import { User } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import React from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { SolidMegaphone, SolidMessages, SolidNotification } from "../../icons";
import { useTokenStore } from "../../modules/auth/useTokenStore";
import { closeVoiceConnections } from "../../modules/webrtc/WebRtcApp";
import { modalConfirm } from "../../shared-components/ConfirmModal";
import { useConn } from "../../shared-hooks/useConn";
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
  const { close: closeWs, user } = useConn();
  const { push } = useRouter();
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
      <DropdownController
        overlay={(close) => (
          <SettingsDropdown
            onActionButtonClicked={() => {
              modalConfirm("Are you sure you want to logout?", () => {
                closeWs();
                closeVoiceConnections(null);
                useCurrentRoomIdStore.getState().setCurrentRoomId(null);
                useTokenStore
                  .getState()
                  .setTokens({ accessToken: "", refreshToken: "" });
                push("/");
              });
            }}
            onCloseDropdown={close}
            user={user}
          />
        )}
      >
        <SingleUser size="sm" src={user.avatarUrl} />
      </DropdownController>
    </div>
  );
};

export default RightHeader;
