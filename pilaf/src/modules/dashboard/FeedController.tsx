import { Room, ScheduledRoom } from "@dogehouse/kebab";
import { useNavigation } from "@react-navigation/core";
import React, { useContext } from "react";
import { RoomCard } from "../../components/RoomCard";
import { useCurrentRoomStore } from "../../global-stores/useCurrentRoomStore";
import { useTypeSafePrefetch } from "../../shared-hooks/useTypeSafePrefetch";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useSoundEffectStore } from "../sound-effect/useSoundEffectStore";
import { WebSocketContext } from "../ws/WebSocketProvider";

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
  const { currentRoom } = useCurrentRoomStore();
  const prefetch = useTypeSafePrefetch("joinRoomAndGetInfo");

  const navigation = useNavigation();
  const playSound = useSoundEffectStore((s) => s.playSoundEffect);
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
            playSound("room_chat_mention");
            if (room.id !== currentRoom?.id) {
              prefetch([room.id], ["joinRoomAndGetInfo", room.id]);
            }
            navigation.navigate("Room", { roomId: room.id });
          }}
        />
      ))}
    </>
  );
};
