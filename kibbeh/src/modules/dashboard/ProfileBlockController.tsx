import React from "react";
import { useCurrentRoomStore } from "../../global-stores/useCurrentRoomStore";
import { useConn } from "../../shared-hooks/useConn";
import { MinimizedRoomCard } from "../../ui/MinimizedRoomCard";
import { ProfileBlock } from "../../ui/ProfileBlock";
import { UpcomingRoomsCard } from "../../ui/UpcomingRoomsCard";
import { UserSummaryCard } from "../../ui/UserSummaryCard";
import { MinimizedRoomCardController } from "./MinimizedRoomCardController";

interface ProfileBlockControllerProps {}

export const ProfileBlockController: React.FC<ProfileBlockControllerProps> = ({}) => {
  const { currentRoom } = useCurrentRoomStore();
  const conn = useConn();
  return (
    <ProfileBlock
      top={
        currentRoom ? (
          <MinimizedRoomCardController room={currentRoom} />
        ) : (
          <UserSummaryCard
            badges={[]}
            website=""
            isOnline={false}
            {...conn.user}
            username={"@" + conn.user.username}
          />
        )
      }
      bottom={<UpcomingRoomsCard rooms={[]} />}
    />
  );
};
