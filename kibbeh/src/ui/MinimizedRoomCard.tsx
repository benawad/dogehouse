import React from "react";
import { Duration } from "date-fns";
import { BoxedIcon } from "./BoxedIcon";
import { SolidFullscreen, SolidMicrophone, SolidVolume } from "../icons";
import { useRouter } from "next/router";
import { Button } from "./Button";

const formatElapsed = (time: Duration) =>
  `${time.hours ? `${time.hours}:` : ""}${time.minutes ?? "0"}:${time.seconds}`;

interface MinimizedRoomCardProps {
  room: {
    name: string;
    speakers: string[];
    url: string;
    timeElapsed: Duration;
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
  room,
}) => {
  const router = useRouter();

  return (
    <div className="bg-primary-800 border border-accent rounded-lg p-4 gap-4 flex-col max-w-md">
      <div className="gap-2 flex-col">
        <h4 className="text-primary-100 ">{room.name}</h4>
        <p className="text-primary-300">{room.speakers.join(", ")}</p>
        <p className="text-accent">
          {room.myself.isSpeaker ? "Speaker" : "Listener"} ·{" "}
          {formatElapsed(room.timeElapsed)}
        </p>
      </div>
      <div className="gap-4">
        <div className="gap-2">
          <BoxedIcon
            onClick={room.myself.switchMuted}
            className={room.myself.isMuted ? "bg-accent" : ""}
          >
            <SolidMicrophone />
          </BoxedIcon>
          <BoxedIcon
            onClick={room.myself.switchDeafened}
            className={room.myself.isDeafened ? "bg-accent" : ""}
          >
            <SolidVolume />
          </BoxedIcon>
          <BoxedIcon onClick={() => router.push(room.url)}>
            <SolidFullscreen />
          </BoxedIcon>
        </div>
        <Button className="flex-grow" onClick={room.myself.leave}>
          Leave
        </Button>
      </div>
    </div>
  );
};
