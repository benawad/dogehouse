import { format, isToday, isTomorrow } from "date-fns";
import Link from "next/link";
import React from "react";
import { SolidPlus } from "../icons";
import { BoxedIcon } from "./BoxedIcon";
import { RoomCardHeading } from "./RoomCardHeading";
import { MultipleUsers } from "./UserAvatar";

const formattedDate = (scheduledFor: Date) => {
  if (isToday(scheduledFor)) {
    return "TODAY " + format(scheduledFor, `K:mm a`);
  } else if (isTomorrow(scheduledFor)) {
    return "TOMMOROW " + format(scheduledFor, `K:mm a`);
  } else {
    return format(scheduledFor, `EEE, do MMM, K:mm a`);
  }
};

export interface UserCardProps {
  avatars: string[];
  speakers: string[];
}

export interface ScheduledRoomSummaryCardProps {
  onClick: () => void;
  id: string;
  scheduledFor: Date;
  speakersInfo: UserCardProps;
  title: string;
  transition?: boolean;
}

export interface UpcomingRoomsCardProps {
  onCreateScheduledRoom: () => void;
  rooms: ScheduledRoomSummaryCardProps[];
}

const UserCard: React.FC<UserCardProps> = ({ avatars, speakers }) => {
  return (
    <div className="w-full flex items-center">
      <MultipleUsers srcArray={avatars} />
      <p className="ml-1 text-primary-300 text-sm">{speakers.join(", ")}</p>
    </div>
  );
};

export const ScheduledRoomSummaryCard: React.FC<ScheduledRoomSummaryCardProps> = ({
  onClick,
  scheduledFor,
  speakersInfo,
  title,
  transition,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 w-full bg-primary-800 flex flex-col gap-2 border-b border-primary-600 cursor-pointer ${transition ? `transition duration-500 ease-in-out` : ``} hover:bg-primary-700 z-0`}
    >
      <div className="text-accent text-sm">{formattedDate(scheduledFor)}</div>
      <RoomCardHeading text={title} />
      <UserCard {...speakersInfo} />
    </button>
  );
};

export const UpcomingRoomsCard: React.FC<UpcomingRoomsCardProps> = ({
  onCreateScheduledRoom,
  rooms,
}) => {
  return (
    <div className="w-full rounded-lg overflow-y-auto flex flex-col">
      <div className="px-4 py-2 bg-primary-800 border-b border-primary-600 flex justify-between items-center">
        <h4 className="text-primary-100 font-bold">Upcoming rooms</h4>
        <BoxedIcon
          onClick={onCreateScheduledRoom}
          style={{ height: "30px", width: "30px" }}
          transition
        >
          <SolidPlus />
        </BoxedIcon>
      </div>
      <div className="flex-col">
        {rooms.map((room) => (
          <ScheduledRoomSummaryCard transition key={room.id} {...room} />
        ))}
      </div>

      <Link href="/scheduled-rooms">
        <a className="px-4 py-3 text-primary-100 font-bold bg-primary-700">
          Explore More Rooms
        </a>
      </Link>
    </div>
  );
};
