import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useConn } from "../../shared-hooks/useConn";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeUpdateQuery } from "../../shared-hooks/useTypeSafeUpdateQuery";
import useWindowSize from "../../shared-hooks/useWindowSize";
import { ProfileBlock } from "../../ui/ProfileBlock";
import { UpcomingRoomsCard } from "../../ui/UpcomingRoomsCard";
import { UserSummaryCard } from "../../ui/UserSummaryCard";
import { CreateScheduleRoomModal } from "../scheduled-rooms/CreateScheduledRoomModal";
import { EditProfileModal } from "../user/EditProfileModal";
import { MinimizedRoomCardController } from "./MinimizedRoomCardController";

interface ProfileBlockControllerProps {}

export const ProfileBlockController: React.FC<ProfileBlockControllerProps> = ({}) => {
  const [upcomingCount, setUpcomingCount] = useState(3);
  const { currentRoomId } = useCurrentRoomIdStore();
  const conn = useConn();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [
    showCreateScheduleRoomModal,
    setShowCreateScheduleRoomModal,
  ] = useState(false);
  const { data } = useTypeSafeQuery(["getScheduledRooms", "", false]);
  const { push } = useRouter();
  const update = useTypeSafeUpdateQuery();
  const { height } = useWindowSize();

  useEffect(() => {
    if (height && height < 780) {
      setUpcomingCount(2);
    } else {
      setUpcomingCount(3);
    }
  }, [height]);

  return (
    <>
      <EditProfileModal
        isOpen={showEditProfileModal}
        onRequestClose={() => setShowEditProfileModal(false)}
      />
      {showCreateScheduleRoomModal ? (
        <CreateScheduleRoomModal
          onScheduledRoom={(srData, resp) => {
            update(["getScheduledRooms", "", false], (d) => {
              return {
                scheduledRooms: [
                  {
                    roomId: null,
                    creator: conn.user!,
                    creatorId: conn.user!.id,
                    description: srData.description,
                    id: resp.scheduledRoom.id,
                    name: srData.name,
                    numAttending: 0,
                    scheduledFor: srData.scheduledFor.toISOString(),
                  },
                  ...(d?.scheduledRooms || []),
                ],
                nextCursor: d?.nextCursor,
              };
            });
          }}
          onRequestClose={() => setShowCreateScheduleRoomModal(false)}
        />
      ) : null}
      <ProfileBlock
        top={
          currentRoomId ? (
            <MinimizedRoomCardController />
          ) : (
            <UserSummaryCard
              onClick={() => setShowEditProfileModal(true)}
              badges={[]}
              website=""
              isOnline={false}
              {...conn.user}
              username={conn.user.username}
            />
          )
        }
        bottom={
          <UpcomingRoomsCard
            onCreateScheduledRoom={() => setShowCreateScheduleRoomModal(true)}
            rooms={
              data?.scheduledRooms.slice(0, upcomingCount).map((sr) => ({
                onClick: () => {
                  push(`/scheduled-room/[id]`, `/scheduled-room/${sr.id}`);
                },
                id: sr.id,
                scheduledFor: new Date(sr.scheduledFor),
                title: sr.name,
                speakersInfo: {
                  avatars: [sr.creator.avatarUrl],
                  speakers: [sr.creator.username],
                },
              })) || []
            }
          />
        }
      />
    </>
  );
};
