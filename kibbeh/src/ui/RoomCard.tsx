import { format, isToday, isPast, differenceInMilliseconds } from "date-fns";
import React, { useEffect, useState } from "react";
import { SmSolidTime } from "../icons";
import { BubbleText } from "./BubbleText";
import { RoomCardHeading } from "./RoomCardHeading";
import { Tag } from "./Tag";

function formatNumber(num: number): string {
  return Math.abs(num) > 999
    ? `${Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1))}K`
    : `${Math.sign(num) * Math.abs(num)}`;
}

function useScheduleRerender(scheduledFor: Date) {
  // same logic stolen from kofta, rerenders
  // at the scheduleFor date
  const [, rerender] = useState(0);

  useEffect(() => {
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

export interface RoomCardProps {
  title: string;
  subtitle: string;
  scheduledFor: Date;
  listeners: number;
  tags: React.ReactNode[];
}

export const RoomCard: React.FC<RoomCardProps> = ({
  title,
  subtitle,
  scheduledFor,
  listeners,
  tags,
}) => {
  useScheduleRerender(scheduledFor);

  const scheduledForLabel = isToday(scheduledFor)
    ? format(scheduledFor, `K:mm a`)
    : format(scheduledFor, `LLL d`);

  const roomLive = isPast(scheduledFor);

  return (
    <div className="p-4 w-full bg-primary-800 hover:bg-primary-800 rounded-lg flex flex-col">
      <div className="w-full flex justify-between space-x-4">
        <RoomCardHeading
          icon={roomLive ? undefined : <SmSolidTime />}
          text={title}
        />
        <div className="flex-shrink-0">
          <BubbleText live={roomLive}>
            {roomLive ? formatNumber(listeners) : scheduledForLabel}
          </BubbleText>
        </div>
      </div>
      <div className="text-primary-300 mt-2">{subtitle}</div>
      <div className="space-x-2 mt-4">
        {tags.map((tag, idx) => (
          <Tag key={idx}>{tag}</Tag>
        ))}
      </div>
    </div>
  );
};
