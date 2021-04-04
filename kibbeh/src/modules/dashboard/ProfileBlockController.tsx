import React, { useState } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useConn } from "../../shared-hooks/useConn";
import { MinimizedRoomCard } from "../../ui/MinimizedRoomCard";
import { ProfileBlock } from "../../ui/ProfileBlock";
import { UpcomingRoomsCard } from "../../ui/UpcomingRoomsCard";
import { UserSummaryCard } from "../../ui/UserSummaryCard";
import { EditProfileModal } from "../user/EditProfileModal";
import { MinimizedRoomCardController } from "./MinimizedRoomCardController";

interface ProfileBlockControllerProps {}

export const ProfileBlockController: React.FC<ProfileBlockControllerProps> = ({}) => {
  const { currentRoomId } = useCurrentRoomIdStore();
  const conn = useConn();
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditProfileModal isOpen={open} onRequestClose={() => setOpen(false)} />
      <ProfileBlock
        top={
          currentRoomId ? (
            <MinimizedRoomCardController roomId={currentRoomId} />
          ) : (
            <UserSummaryCard
              onClick={() => setOpen(true)}
              badges={[]}
              website=""
              isOnline={false}
              {...conn.user}
              username={conn.user.username}
            />
          )
        }
        bottom={<UpcomingRoomsCard rooms={[]} />}
      />
    </>
  );
};
