import React, { useContext, useState } from "react";
import { useCurrentRoomStore } from "../../global-stores/useCurrentRoomStore";
import { useTypeSafePrefetch } from "../../shared-hooks/useTypeSafePrefetch";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { RoomCard } from "../../components/RoomCard";

interface FeedControllerProps {}

export const FeedController: React.FC<FeedControllerProps> = ({}) => {
  const { conn } = useContext(WebSocketContext);
  // @todo pagination
  const { isLoading, data } = useTypeSafeQuery("getTopPublicRooms", {
    staleTime: Infinity,
    enabled: !!conn,
    refetchOnMount: "always",
    refetchInterval: 10000,
  });
  const [roomModal, setRoomModal] = useState(false);
  const { currentRoom } = useCurrentRoomStore();
  const prefetch = useTypeSafePrefetch("getRoomUsers");

  if (!conn || isLoading || !data) {
    return null;
  }

  return (
    <>
      {data.rooms.map((room, index) => (
        <RoomCard
          key={index}
          style={{ marginBottom: 20 }}
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
          avatarSrcs={[]}
          onPress={() => {
            if (room.id !== currentRoom?.id) {
              prefetch([room.id], ["getRoomUsers", room.id]);
            }
          }}
        />
      ))}
      {/* <Feed
        onRoomClick={(room) => {
          if (room.id !== currentRoom?.id) {
            prefetch([room.id], ["getRoomUsers", room.id]);
          }
        }}
        actionTitle="New room"
        emptyPlaceholder={<div>empty</div>}
        onActionClicked={() => setRoomModal(true)}
        rooms={data.rooms}
        title="Your Feed"
      /> */}
    </>
  );
};
