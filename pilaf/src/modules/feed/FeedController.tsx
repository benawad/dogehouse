import { Room, ScheduledRoom } from "@dogehouse/kebab";
import { useNavigation } from "@react-navigation/core";
import React, { useContext } from "react";
import { RoomCard } from "../../components/RoomCard";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useRoomChatStore } from "../../modules/room/chat/useRoomChatStore";
import { WebSocketContext } from "../../modules/ws/WebSocketProvider";
import { useTypeSafePrefetch } from "../../shared-hooks/useTypeSafePrefetch";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";

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
  const { currentRoomId } = useCurrentRoomIdStore();
  const prefetch = useTypeSafePrefetch();

  const navigation = useNavigation();
  const [clearChat] = useRoomChatStore((s) => [s.clearChat]);
  if (!conn || isLoading || !data) {
    return null;
  }

  return (
    <>
      {data.rooms.map((room: Room | ScheduledRoom, index) => (
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
            if (room.id !== currentRoomId) {
              clearChat();
              prefetch(["joinRoomAndGetInfo", room.id], [room.id]);
            }
            navigation.navigate("Room", { roomId: room.id });
          }}
        />
      ))}
    </>
  );
};
