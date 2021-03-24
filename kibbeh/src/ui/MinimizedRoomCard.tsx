import React from "react";
import { BoxedIcon } from "./BoxedIcon";
import { SolidFullscreen, SolidMicrophone } from "../icons";
import { useRouter } from "next/router";
import { Button } from "./Button";
import { DurationTicker } from "./DurationTicker";
import SvgSolidMicrophoneOff from "../icons/SolidMicrophoneOff";

interface MinimizedRoomCardProps {
  leaveLoading?: boolean;
  room: {
    name: string;
    speakers: string[];
    url: string;
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
  leaveLoading,
  room,
}) => {
  const router = useRouter();

  return (
    <div className="bg-primary-800 border border-accent rounded-lg p-4 gap-4 flex-col w-full">
      <div className="gap-2 flex-col">
        <h4 className="text-primary-100 ">{room.name}</h4>
        <p className="text-primary-300">{room.speakers.join(", ")}</p>
        <p className="text-accent">
          {room.myself.isSpeaker ? "Speaker" : "Listener"} ·{" "}
          <DurationTicker dt={room.roomStartedAt} />
        </p>
      </div>
      <div className="gap-4">
        <div className="gap-2">
          <BoxedIcon
            onClick={room.myself.switchMuted}
            className={room.myself.isMuted ? "bg-accent" : ""}
          >
            {room.myself.isMuted ? (
              <SvgSolidMicrophoneOff />
            ) : (
              <SolidMicrophone />
            )}
          </BoxedIcon>
          {/* @todo haven't added deafen yet */}
          {/* <BoxedIcon
            onClick={room.myself.switchDeafened}
            className={room.myself.isDeafened ? "bg-accent" : ""}
          >
            <SolidVolume />
          </BoxedIcon> */}
          <BoxedIcon onClick={() => router.push(room.url)}>
            <SolidFullscreen />
          </BoxedIcon>
        </div>
        <Button
          loading={leaveLoading}
          className="flex-grow"
          onClick={room.myself.leave}
        >
          Leave
        </Button>
      </div>
    </div>
  );
};
