import React from "react";
import {
  SolidChatBubble,
  SolidCompass,
  SolidFriends,
  SolidMicrophone,
  SolidMicrophoneOff,
  SolidSettings,
  SolidVolume,
  SolidVolumeOff,
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
      <div className="flex my-1 sm:my-0">
        {mute ? (
          <BoxedIcon
            transition
            hover={mute.isMuted}
            className={`mr-2 ${mute.isMuted ? `bg-accent` : ``}`}
            color="800"
            title={t("components.bottomVoiceControl.toggleMuteMicBtn")}
            onClick={() => mute.onMute()}
            data-testid="mute"
          >
            {mute.isMuted ? <SolidMicrophoneOff /> : <SolidMicrophone />}
          </BoxedIcon>
        ) : null}
        {deaf ? (
          <BoxedIcon
            transition
            hover={deaf.isDeaf}
            className={`mr-2 ${deaf.isDeaf ? `bg-accent` : ``}`}
            color="800"
            title={t("components.bottomVoiceControl.toggleDeafMicBtn")}
            onClick={() => deaf.onDeaf()}
            data-testid="deafen"
          >
            {deaf.isDeaf ? <SolidVolumeOff /> : <SolidVolume />}
          </BoxedIcon>
        ) : null}
        {onInvitePeopleToRoom ? (
          <BoxedIcon
            transition
            className="mr-2"
            color="800"
            title={t("components.bottomVoiceControl.inviteUsersToRoomBtn")}
            onClick={onInvitePeopleToRoom}
            data-testid="invite-friends"
          >
            {/* @todo swap out right icon */}
            <SolidFriends />
          </BoxedIcon>
        ) : null}
        {screenType === "1-cols" || screenType === "fullscreen" ? (
          <BoxedIcon
            transition
            className="mr-2"
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
            className="mr-2"
            color="800"
            title={t("components.bottomVoiceControl.settings")}
            onClick={onRoomSettings}
            data-testid="room-settings"
          >
            <SolidSettings />
          </BoxedIcon>
        ) : null}
      </div>

      <Button
        transition
        className={`my-1 sm:my-0`}
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
