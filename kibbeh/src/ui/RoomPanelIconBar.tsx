import React from "react";
import {
  SolidChatBubble,
  SolidDeafened,
  SolidDeafenedOff,
  SolidFriendsAdd,
  SolidMicrophone,
  SolidMicrophoneOff,
  SolidSettings,
} from "../icons";
import { useScreenType } from "../shared-hooks/useScreenType";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { BoxedIcon } from "./BoxedIcon";
import { Button } from "./Button";

interface RoomPanelIconBarProps {
  mute?: {
    isMuted: boolean;
    onMute: () => void;
  };
  deaf?: {
    isDeaf: boolean;
    onDeaf: () => void;
  };
  onInvitePeopleToRoom?: () => void;
  onRoomSettings?: () => void;
  onLeaveRoom(): void;
  onToggleChat(): void;
}

export const RoomPanelIconBar: React.FC<RoomPanelIconBarProps> = ({
  mute,
  deaf,
  onInvitePeopleToRoom,
  onRoomSettings,
  onLeaveRoom,
  onToggleChat,
}) => {
  const { t } = useTypeSafeTranslation();
  const screenType = useScreenType();
  return (
    <div className="flex flex-wrap justify-center bg-primary-700 rounded-b-8 py-3 px-4 w-full sm:justify-between">
      <div className="flex my-1 justify-between w-full sm:my-0 sm:w-auto">
        {mute ? (
          <BoxedIcon
            transition
            hover={!mute.isMuted}
            className={`mx-1 w-11 h-6.5 ${
              !mute.isMuted && !deaf?.isDeaf
                ? `bg-accent hover:bg-accent-hover text-button`
                : ``
            }`}
            color="800"
            title={t("components.bottomVoiceControl.toggleMuteMicBtn")}
            onClick={() => mute.onMute()}
            data-testid="mute"
          >
            {mute.isMuted || deaf?.isDeaf ? (
              <SolidMicrophoneOff width="20" height="20" />
            ) : (
              <SolidMicrophone width="20" height="20" />
            )}
          </BoxedIcon>
        ) : null}
        {deaf ? (
          <BoxedIcon
            transition
            hover={deaf.isDeaf}
            className={`mx-1 h-6.5 w-6.5 ${
              deaf.isDeaf ? `bg-accent hover:bg-accent-hover text-button` : ``
            }`}
            color="800"
            title={t("components.bottomVoiceControl.toggleDeafMicBtn")}
            onClick={() => deaf.onDeaf()}
            data-testid="deafen"
          >
            {deaf.isDeaf ? (
              <SolidDeafenedOff width="20" height="20" />
            ) : (
              <SolidDeafened width="20" height="20" />
            )}
          </BoxedIcon>
        ) : null}
        {onInvitePeopleToRoom ? (
          <BoxedIcon
            transition
            className="mx-1 h-6.5 w-6.5"
            color="800"
            title={t("components.bottomVoiceControl.inviteUsersToRoomBtn")}
            onClick={onInvitePeopleToRoom}
            data-testid="invite-friends"
          >
            <SolidFriendsAdd height="20" />
          </BoxedIcon>
        ) : null}
        {screenType === "1-cols" ? (
          <BoxedIcon
            transition
            className="mx-1 h-6.5 w-6.5"
            color="800"
            onClick={onToggleChat}
            data-testid="chat"
          >
            <SolidChatBubble />
          </BoxedIcon>
        ) : null}
        {onRoomSettings ? (
          <BoxedIcon
            transition
            className="mx-1 h-6.5 w-6.5"
            color="800"
            title={t("components.bottomVoiceControl.settings")}
            onClick={onRoomSettings}
            data-testid="room-settings"
          >
            <SolidSettings width="20" height="20" />
          </BoxedIcon>
        ) : null}
      </div>

      <Button
        transition
        className={`my-1 mx-1 w-full text-base sm:my-0 sm:mx-0 sm:w-15`}
        color="secondary-800"
        onClick={() => {
          onLeaveRoom();
        }}
        data-testid="leave-room"
      >
        {t("components.bottomVoiceControl.leave")}
      </Button>
    </div>
  );
};
