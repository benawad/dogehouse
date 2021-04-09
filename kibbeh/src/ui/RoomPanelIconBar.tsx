import React from "react";
import {
  SolidCompass,
  SolidFriends,
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
  return (
    <div className="justify-between bg-primary-700 rounded-b-8 py-3 px-4 w-full">
      <div>
        {mute ? (
          <BoxedIcon className="mr-2" color="800" onClick={() => mute.onMute()}>
            {mute.isMuted ? <SolidMicrophoneOff /> : <SolidMicrophone />}
          </BoxedIcon>
        ) : null}
        {onInvitePeopleToRoom ? (
          <BoxedIcon
            className="mr-2"
            color="800"
            onClick={onInvitePeopleToRoom}
          >
            {/* @todo swap out right icon */}
            <SolidFriends />
          </BoxedIcon>
        ) : null}
        {screenType === "1-cols" || screenType === "fullscreen" ? (
          // @todo put chat icon
          <BoxedIcon className="mr-2" color="800" onClick={onToggleChat}>
            <SolidCompass />
          </BoxedIcon>
        ) : null}
        {onRoomSettings ? (
          <BoxedIcon className="mr-2" color="800" onClick={onRoomSettings}>
            <SolidSettings />
          </BoxedIcon>
        ) : null}
      </div>

      <Button
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
