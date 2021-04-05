import { format, isToday, isPast, differenceInMilliseconds } from "date-fns";
import React, { useEffect, useState } from "react";
import { SolidTime } from "../icons";
import { BubbleText } from "./BubbleText";
import { RoomCardHeading } from "./RoomCardHeading";
import { Tag } from "./Tag";

function formatNumber(num: number): string {
  return Math.abs(num) > 999
    ? `${Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1))}K`
    : `${Math.sign(num) * Math.abs(num)}`;
}

function useScheduleRerender(scheduledFor?: Date) {
  // same logic stolen from kofta, rerenders
  // at the scheduleFor date
  const [, rerender] = useState(0);

  useEffect(() => {
    if (!scheduledFor) {
      return;
    }

    let done = false;
    const id = setTimeout(() => {
      done = true;
      rerender((x) => x + 1);
    }, differenceInMilliseconds(scheduledFor, new Date()) + 1000);

    return () => {
      if (!done) {
        clearTimeout(id);
      }
    };
  }, [scheduledFor]);
}

export type RoomCardProps = {
  title: string;
  subtitle: string;
  scheduledFor?: Date;
  listeners: number;
  tags: React.ReactNode[];
  onClick?: () => void;
};

export const RoomCard: React.FC<RoomCardProps> = ({
  title,
  subtitle,
  scheduledFor,
  listeners,
  tags,
  onClick,
}) => {
  useScheduleRerender(scheduledFor);

  let scheduledForLabel = "";

  if (scheduledFor) {
    if (isToday(scheduledFor)) {
      scheduledForLabel = format(scheduledFor, `K:mm a`);
    } else {
      scheduledForLabel = format(scheduledFor, `LLL d`);
    }
  }

  const roomLive = !scheduledFor || isPast(scheduledFor);

  return (
    <button
      onClick={onClick}
      className="p-4 w-full bg-primary-800 hover:bg-primary-800 rounded-lg flex flex-col"
    >
      <div className="w-full flex justify-between space-x-4">
        <RoomCardHeading
          icon={roomLive ? undefined : <SolidTime />}
          text={title}
        />
        <div className="flex-shrink-0">
          <BubbleText live={roomLive}>
            {roomLive ? formatNumber(listeners) : scheduledForLabel}
          </BubbleText>
        </div>
      </div>
      <p className="block break-words line-clamp-2 mt-2 text-left text-primary-300 truncate w-full whitespace-pre-wrap">
        {subtitle}
      </p>
      <div className="space-x-2 mt-4">
        {tags.map((tag, idx) => (
          <Tag key={idx}>{tag}</Tag>
        ))}
      </div>
    </button>
  );
};
