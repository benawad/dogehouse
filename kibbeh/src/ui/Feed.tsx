import React, { MouseEventHandler, ReactNode } from "react";
import { RoomCardProps, RoomCard } from "./RoomCard";
import { Button } from "./Button";

export interface FeedProps {
  title: string;
  actionTitle: string;
  onActionClicked: MouseEventHandler<HTMLButtonElement>;
  rooms: RoomCardProps[];
  emptyPlaceholder: ReactNode;
}

export const Feed: React.FC<FeedProps> = ({
  title,
  actionTitle,
  onActionClicked,
  rooms,
  emptyPlaceholder,
}) => {
  return (
    <div className="flex-1 flex-col">
      <div className="justify-between items-end mb-5">
        <h4 className="text-primary-100 ml-4">{title}</h4>
        <Button onClick={onActionClicked}>{actionTitle}</Button>
      </div>
      <div className="flex-col space-y-4">
        {rooms.length === 0 && emptyPlaceholder}
        {/* <hr className="border-primary-600" /> */}
        {rooms.map((room, index) => (
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
