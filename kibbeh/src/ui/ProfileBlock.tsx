import React from "react";
import { MinimizedRoomCard } from './MinimizedRoomCard';
import { UserSummaryCard, UserSummaryCardProps } from './UserSummaryCard';
import { UpcomingRoomsCard, ScheduledRoomSummaryCardProps } from './UpcomingRoomsCard';

interface MinimizedRoomCardProps {
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
}

export interface ProfileBlockProps {
  userDetails?: UserSummaryCardProps;
  connectedRoom?: MinimizedRoomCardProps;
  upcomingRooms?: ScheduledRoomSummaryCardProps[];
}

export const ProfileBlock: React.FC<ProfileBlockProps> = ({
  userDetails,
  connectedRoom,
  upcomingRooms
}) => {
  return (
    <div className="flex-1 flex-col">
      {
        userDetails
          ? <div className="justify-between items-end mb-5 max-w-md">
              <UserSummaryCard {...userDetails}/>
            </div> : ''
      }
      {
        connectedRoom
          ? <div className="justify-between items-end mb-5">
              <MinimizedRoomCard room={connectedRoom} />
            </div> : ''
      }
      {
        upcomingRooms
          ? <div className="justify-between items-end mb-5 max-w-md">
              <UpcomingRoomsCard rooms={upcomingRooms} />
            </div> : ''
      }
    </div>
  );
};
