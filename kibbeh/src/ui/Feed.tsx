import React, { FC, MouseEventHandler, ReactNode } from "react";
import { RoomCard } from "./RoomCard";
import { Button } from "./Button";
import { Room, ScheduledRoom } from "@dogehouse/kebab";

export interface FeedProps {
  rooms: Array<Room | ScheduledRoom>;
  emptyPlaceholder: ReactNode;
  onRoomClick?: (room: Room | ScheduledRoom) => void;
}

export interface FeedHeaderProps {
  title: string;
  actionTitle: string;
  onActionClicked: MouseEventHandler<HTMLButtonElement>;
}

export const FeedHeader: FC<FeedHeaderProps> = ({
  actionTitle,
  onActionClicked,
  title,
}) => {
  return (
    <div className="justify-between items-end mb-5">
      <h4 className="text-primary-100 mb-auto">{title}</h4>
      <Button onClick={onActionClicked}>{actionTitle}</Button>
    </div>
  );
};

export const Feed: React.FC<FeedProps> = ({
  rooms,
  emptyPlaceholder,
  onRoomClick,
}) => {
  return (
    <div className="flex-1 flex-col" data-testid="feed">
      <div className="flex-col space-y-4">
        {rooms.length === 0 && emptyPlaceholder}
        {/* <hr className="border-primary-600" /> */}
        {rooms.map((room, index) => (
          <RoomCard
            onClick={() => onRoomClick?.(room)}
            key={index}
            title={room.name}
            subtitle={
              "peoplePreviewList" in room
                ? room.peoplePreviewList
                    .slice(0, 3)
                    .map((x) => x.displayName)
                    .join(", ")
                : ""
            }
            scheduledFor={
              "scheduledFor" in room ? new Date(room.scheduledFor) : undefined
            }
            listeners={"numPeopleInside" in room ? room.numPeopleInside : 0}
            tags={[]}
          />
        ))}
      </div>
    </div>
  );
};
