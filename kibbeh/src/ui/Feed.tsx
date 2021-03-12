import React, {
  MouseEventHandler,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { RoomCardProps, RoomCard } from "./RoomCard";
import { Button } from "./Button";
import { isPast } from "date-fns";

export interface FeedProps {
  title: string;
  actionTitle: string;
  onActionClicked: MouseEventHandler<HTMLButtonElement>;
  rooms: RoomCardProps[];
  emptyPlaceholder: ReactNode;
}

export interface FeedHeaderProps {
  title: string;
  actionTitle: string;
  onActionClicked: MouseEventHandler<HTMLButtonElement>;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  title,
  actionTitle,
  onActionClicked,
}) => (
  <div className="justify-between items-end mb-5">
    <h4 className="text-primary-100 ml-4">{title}</h4>
    <Button onClick={onActionClicked}>{actionTitle}</Button>
  </div>
);

export const Feed: React.FC<FeedProps> = ({
  title,
  actionTitle,
  onActionClicked,
  rooms,
  emptyPlaceholder,
}) => {
  const [liveRooms, setLiveRooms] = useState<RoomCardProps[]>([]);
  const [scheduledRooms, setScheduledRooms] = useState<RoomCardProps[]>([]);

  useEffect(() => {
    setLiveRooms(rooms.filter((room) => isPast(room.scheduledFor)));
    setScheduledRooms(rooms.filter((room) => !isPast(room.scheduledFor)));
  }, [rooms]);

  return (
    <div className="flex-1 flex-col">
      <div className="justify-between items-end mb-5">
        <h4 className="text-primary-100 ml-4">{title}</h4>
        <Button onClick={onActionClicked}>{actionTitle}</Button>
      </div>
      <div className="flex-col space-y-4">
        {rooms.length === 0 && emptyPlaceholder}
        {liveRooms.map((room, index) => (
          <RoomCard
            key={index}
            title={room.title}
            subtitle={room.subtitle}
            scheduledFor={room.scheduledFor}
            listeners={room.listeners}
            tags={room.tags}
          />
        ))}
        {liveRooms.length > 0 && scheduledRooms.length > 0 && (
          <hr className="border-primary-600" />
        )}
        {scheduledRooms.map((room, index) => (
          <RoomCard
            key={index}
            title={room.title}
            subtitle={room.subtitle}
            scheduledFor={room.scheduledFor}
            listeners={room.listeners}
            tags={room.tags}
          />
        ))}
      </div>
    </div>
  );
};
