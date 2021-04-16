import React from "react";
import { BoxedIcon } from "./BoxedIcon";
import { SolidFullscreen, SolidMicrophone, SolidVolume } from "../icons";
import { useRouter } from "next/router";
import { Button } from "./Button";
import { DurationTicker } from "./DurationTicker";
import SvgSolidMicrophoneOff from "../icons/SolidMicrophoneOff";

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
  // gap-n only works with grid
  return (
    <div
      className="bg-primary-800 border border-accent rounded-lg p-4 gap-4 grid max-w-md w-full"
      data-testid="minimized-room-card"
    >
      <div className="flex gap-1 grid">
        <h4 className="text-primary-100 break-all overflow-hidden">
          {room.name}
        </h4>
        <p className="text-primary-300 overflow-ellipsis overflow-hidden w-auto">
          {room.speakers.join(", ")}
        </p>
        <p className="text-accent">
          {room.myself.isSpeaker ? "Speaker" : "Listener"} ·{" "}
          <DurationTicker dt={room.roomStartedAt} />
        </p>
      </div>
      <div className="flex flex flex-row">
        <div className="flex grid grid-cols-3 gap-2">
          <BoxedIcon
            transition
            hover={room.myself.isMuted}
            onClick={room.myself.switchMuted}
            className={room.myself.isMuted ? "bg-accent" : ""}
          >
            {room.myself.isMuted ? (
              <SvgSolidMicrophoneOff data-testid="mic-off-icon" />
            ) : (
              <SolidMicrophone data-testid="mic-icon" />
            )}
          </BoxedIcon>
          {/* <BoxedIcon
            onClick={room.myself.switchDeafened}
            className={room.myself.isDeafened ? "bg-accent" : ""}
          >
            <SolidVolume />
          </BoxedIcon> */}
          <BoxedIcon transition onClick={onFullscreenClick}>
            <SolidFullscreen />
          </BoxedIcon>
        </div>
        <Button
          transition
          loading={leaveLoading}
          className="flex-grow ml-4"
          onClick={room.myself.leave}
        >
          Leave
        </Button>
      </div>
    </div>
  );
};
