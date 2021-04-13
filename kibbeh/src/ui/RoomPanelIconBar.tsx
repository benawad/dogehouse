import React, { useState, useCallback, useEffect } from "react";
import {
  SolidCompass,
  SolidFriends,
  SolidMicrophone,
  SolidMicrophoneOff,
  SolidSettings,
} from "../icons";
import { showErrorToast } from "../lib/showErrorToast";
import { useDevices } from "../shared-hooks/useDevices";
import { useScreenType } from "../shared-hooks/useScreenType";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { BoxedIcon } from "./BoxedIcon";
import { Button } from "./Button";
import { ErrorToast } from "./ErrorToast";

interface RoomPanelIconBarProps {
  mute?: {
    isMuted: boolean;
    onMute: () => void;
  };
  onInvitePeopleToRoom?: () => void;
  onRoomSettings?: () => void;
  onLeaveRoom(): void;
  onToggleChat(): void;
}

export const RoomPanelIconBar: React.FC<RoomPanelIconBarProps> = ({
  mute,
  onInvitePeopleToRoom,
  onRoomSettings,
  onLeaveRoom,
  onToggleChat,
}) => {
  const { t } = useTypeSafeTranslation();
  const screenType = useScreenType();
  const { devices } = useDevices();

  useEffect(() => {
    if (devices.length === 0) {
      showErrorToast(t("pages.voiceSettings.permissionError"));
    }
  }, [devices.length, t]);

  return (
    <div className="justify-between bg-primary-700 rounded-b-8 py-3 px-4 w-full">
      <div>
        {mute ? (
          <BoxedIcon
            transition
            hover={mute.isMuted}
            className={`mr-2 ${mute.isMuted ? `bg-accent` : ``}`}
            color="800"
            title={t("components.bottomVoiceControl.toggleMuteMicBtn")}
            onClick={() => mute.onMute()}
          >
            {mute.isMuted ? <SolidMicrophoneOff /> : <SolidMicrophone />}
          </BoxedIcon>
        ) : null}
        {onInvitePeopleToRoom ? (
          <BoxedIcon
            transition
            className="mr-2"
            color="800"
            title={t("components.bottomVoiceControl.inviteUsersToRoomBtn")}
            onClick={onInvitePeopleToRoom}
          >
            {/* @todo swap out right icon */}
            <SolidFriends />
          </BoxedIcon>
        ) : null}
        {screenType === "1-cols" || screenType === "fullscreen" ? (
          // @todo put chat icon
          <BoxedIcon
            transition
            className="mr-2"
            color="800"
            onClick={onToggleChat}
          >
            <SolidCompass />
          </BoxedIcon>
        ) : null}
        {onRoomSettings ? (
          <BoxedIcon
            transition
            className="mr-2"
            color="800"
            title={t("components.bottomVoiceControl.settings")}
            onClick={onRoomSettings}
          >
            <SolidSettings />
          </BoxedIcon>
        ) : null}
      </div>

      <Button
        transition
        className={`ml-2`}
        color="secondary-800"
        onClick={() => {
          onLeaveRoom();
        }}
      >
        {t("components.bottomVoiceControl.leave")}
      </Button>
    </div>
  );
};
