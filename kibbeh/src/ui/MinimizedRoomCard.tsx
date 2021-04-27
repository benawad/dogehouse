import React from "react";
import { BoxedIcon } from "./BoxedIcon";
import {
  SolidDeafened,
  SolidDeafenedOff,
  SolidFullscreen,
  SolidMicrophone,
} from "../icons";
import { Button } from "./Button";
import { DurationTicker } from "./DurationTicker";
import SvgSolidMicrophoneOff from "../icons/SolidMicrophoneOff";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";

export interface MinimizedRoomCardProps {
  onFullscreenClick?: () => void;
  leaveLoading?: boolean;
  room: {
    name: string;
    speakers: string[];
    roomStartedAt: Date;
    myself: {
      isSpeaker: boolean;
      isMuted: boolean;
      switchMuted(): void;
      isDeafened: boolean;
      switchDeafened(): void;
      leave(): void;
    };
  };
}

export const MinimizedRoomCard: React.FC<MinimizedRoomCardProps> = ({
  onFullscreenClick,
  leaveLoading,
  room,
}) => {
  const { t } = useTypeSafeTranslation();
  // gap-n only works with grid
  return (
    <div
      className="bg-primary-800 border border-accent rounded-lg p-4 gap-4 grid max-w-md w-full"
      data-testid="minimized-room-card"
    >
      <div className="gap-1 grid">
        <h4 className="text-primary-100 break-all overflow-hidden">
          {room.name}
        </h4>
        <div className="text-primary-300 overflow-ellipsis overflow-hidden w-auto">
          {room.speakers.join(", ")}
        </div>
        <div className="text-accent">
          {room.myself.isSpeaker
            ? t("components.bottomVoiceControl.speaker")
            : t("components.bottomVoiceControl.listener")}{" "}
          · <DurationTicker dt={room.roomStartedAt} />
        </div>
      </div>
      <div className="flex flex-row">
        <div className="grid grid-cols-3 gap-2">
          {room.myself.isSpeaker ? (
            <BoxedIcon
              data-testid="mute"
              transition
              hover={room.myself.isMuted}
              onClick={room.myself.switchMuted}
              className={
                !room.myself.isMuted && !room.myself.isDeafened
                  ? "bg-accent hover:bg-accent-hover text-button"
                  : ""
              }
            >
              {room.myself.isMuted || room.myself.isDeafened ? (
                <SvgSolidMicrophoneOff />
              ) : (
                <SolidMicrophone />
              )}
            </BoxedIcon>
          ) : null}
          <BoxedIcon
            data-testid="deafen"
            onClick={room.myself.switchDeafened}
            className={
              room.myself.isDeafened
                ? "bg-accent hover:bg-accent-hover text-button"
                : ""
            }
          >
            {room.myself.isDeafened ? <SolidDeafenedOff /> : <SolidDeafened />}
          </BoxedIcon>
          <BoxedIcon transition onClick={onFullscreenClick}>
            <SolidFullscreen />
          </BoxedIcon>
        </div>
        <Button
          transition
          color="primary-300"
          loading={leaveLoading}
          className="flex-grow ml-4"
          onClick={room.myself.leave}
        >
          {t("components.bottomVoiceControl.leave")}
        </Button>
      </div>
    </div>
  );
};
