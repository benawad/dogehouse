import React from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useConn } from "../../shared-hooks/useConn";
import { MinimizedRoomCard } from "../../ui/MinimizedRoomCard";
import { ProfileBlock } from "../../ui/ProfileBlock";
import { UpcomingRoomsCard } from "../../ui/UpcomingRoomsCard";
import { UserSummaryCard } from "../../ui/UserSummaryCard";
import { MinimizedRoomCardController } from "./MinimizedRoomCardController";

interface ProfileBlockControllerProps {}

export const ProfileBlockController: React.FC<ProfileBlockControllerProps> = ({}) => {
  const { currentRoomId } = useCurrentRoomIdStore();
  const conn = useConn();
  return (
    <ProfileBlock
      top={
        currentRoomId ? (
          <MinimizedRoomCardController roomId={currentRoomId} />
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
