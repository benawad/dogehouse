import { format, isToday, isTomorrow } from "date-fns";
import Link from "next/link";
import React from "react";
import { SolidPlus } from "../icons";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { BoxedIcon } from "./BoxedIcon";
import { RoomCardHeading } from "./RoomCardHeading";
import { MultipleUsers } from "./UserAvatar";

interface FormattedDateProps {
  scheduledFor: Date;
}

const FormattedDate: React.FC<FormattedDateProps> = ({ scheduledFor }) => {
  const { t } = useTypeSafeTranslation();
  let text = "";
  if (isToday(scheduledFor)) {
    text = format(scheduledFor, `h:mm a`);
  } else {
    text = format(scheduledFor, `do MMM, h:mm a`);
  }
  return <>{text}</>;
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
      <div className="flex ml-1 text-primary-300 text-sm">
        {speakers.join(", ")}
      </div>
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
      className={`px-4 py-2 w-full bg-primary-800 flex flex-col gap-2 border-b border-primary-600 cursor-pointer last:border-b-0 ${transition ? `transition duration-200 ease-in-out` : ``
        } hover:bg-primary-700 z-0`}
    >
      <div className="flex text-accent text-sm uppercase">
        <FormattedDate scheduledFor={scheduledFor} />
      </div>
      <RoomCardHeading text={title} />
      <UserCard {...speakersInfo} />
    </button>
  );
};

export const UpcomingRoomsCard: React.FC<UpcomingRoomsCardProps> = ({
  onCreateScheduledRoom,
  rooms,
}) => {
  const { t } = useTypeSafeTranslation();
  return (
    <div className="w-full rounded-lg overflow-y-auto flex flex-col">
      <div className="px-4 py-3 bg-primary-800 border-b border-primary-600 flex justify-between items-center">
        <h4 className="text-primary-100 font-bold">
          {t("components.upcomingRoomsCard.upcomingRooms")}
        </h4>
        <BoxedIcon
          data-testid="create-scheduled-room"
          onClick={onCreateScheduledRoom}
          style={{ height: "26px", width: "26px" }}
          transition
        >
          <SolidPlus width={12} height={12} />
        </BoxedIcon>
      </div>
      <div className="flex flex-col">
        {rooms.map((room) => (
          <ScheduledRoomSummaryCard transition key={room.id} {...room} />
        ))}
      </div>

      <Link href="/scheduled-rooms">
        <a
          className="px-4 py-3 text-primary-100 font-bold bg-primary-700"
          data-testid="view-scheduled-rooms"
        >
          {t("components.upcomingRoomsCard.exploreMoreRooms")}
        </a>
      </Link>
    </div>
  );
};
