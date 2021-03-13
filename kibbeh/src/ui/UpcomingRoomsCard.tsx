import { format, isToday, isTomorrow } from "date-fns";
import React from "react";
import { SmSolidPlus } from "../icons";
import { BoxedIcon } from "./BoxedIcon";
import { RoomCardHeading } from "./RoomCardHeading";
import { MultipleUsers } from "./UserAvatar";

const formattedDate = (scheduledFor: Date) => (
  isToday(scheduledFor)
    ? "TODAY " + format(scheduledFor, `K:mm a`)
    : isTomorrow(scheduledFor)
    ? "TOMMOROW " + format(scheduledFor, `K:mm a`)
    : format(scheduledFor, `EEE, do MMM, K:mm a`)
);

export interface UserCardProps {
  avatars: string[];
  speakers: string[];
}

export interface ScheduledRoomSummaryCardProps {
  scheduledFor: Date;
  speakersInfo: UserCardProps;
  title: string;
}

export interface UpcomingRoomsCardProps {
    rooms: ScheduledRoomSummaryCardProps[]
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
  scheduledFor,
  speakersInfo,
  title,
}) => {
  return (
    <div className="px-4 py-2 w-full bg-primary-800 flex flex-col gap-2 border-b border-primary-600 cursor-pointer hover:bg-primary-700 z-0">
      <div className="text-accent text-sm">{formattedDate(scheduledFor)}</div>
      <RoomCardHeading text={title} />
      <UserCard {...speakersInfo} />
    </div>
  );
};

export const UpcomingRoomsCard: React.FC<UpcomingRoomsCardProps> = ({ rooms }) => {
  return (
    <div className="w-full rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-2 bg-primary-800 border-b border-primary-600 flex justify-between items-center">
        <h4 className="text-primary-100 font-bold">Upcoming rooms</h4>
        <BoxedIcon style={{ height: "30px", width: "30px" }}>
          <SmSolidPlus />
        </BoxedIcon>
      </div>
      {rooms.map(room => (
          <ScheduledRoomSummaryCard {...room} />
      ))}
      <div className="px-4 py-3 text-primary-100 font-bold bg-primary-700">
        Explore More Rooms
      </div>
    </div>
  );
};
