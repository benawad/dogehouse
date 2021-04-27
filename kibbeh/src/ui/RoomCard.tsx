import { format, isToday, isPast, differenceInMilliseconds } from "date-fns";
import React, { useEffect, useState } from "react";
import { SolidTime } from "../icons";
import { BubbleText } from "./BubbleText";
import { RoomCardHeading } from "./RoomCardHeading";
import { Tag } from "./Tag";
import { MultipleUsers, SingleUser } from "./UserAvatar";

export function formatNumber(num: number): string {
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
  avatars: string[];
  scheduledFor?: Date;
  listeners: number;
  tags: React.ReactNode[];
  onClick?: () => void;
};

export const RoomCard: React.FC<RoomCardProps> = ({
  title,
  subtitle,
  avatars,
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
      data-testid={`room-card:${title}`}
      onClick={onClick}
      className="flex flex-col w-full p-4 rounded-lg transition duration-200 ease-in-out bg-primary-800 hover:bg-primary-700"
    >
      <div className="flex justify-between w-full space-x-4">
        <RoomCardHeading
          icon={roomLive ? undefined : <SolidTime />}
          text={title}
        />
        <div className="flex flex-shrink-0">
          <BubbleText live={roomLive}>
            {roomLive ? formatNumber(listeners) : scheduledForLabel}
          </BubbleText>
        </div>
      </div>
      <div className="w-full mt-2 flex">
        {avatars.length > 0 ? (
          <MultipleUsers className="mr-2" srcArray={avatars} />
        ) : null}
        <div className="text-left break-all truncate whitespace-pre-wrap line-clamp-2 text-primary-300">
          {subtitle}
        </div>
      </div>
      <div className="flex mt-4 space-x-2">
        {tags.map((tag, idx) => (
          <Tag key={idx}>{tag}</Tag>
        ))}
      </div>
    </button>
  );
};
