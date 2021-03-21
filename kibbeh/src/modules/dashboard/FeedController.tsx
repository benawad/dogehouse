import { wrap, GetTopPublicRoomsResponse } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useCurrentRoomStore } from "../../global-stores/useCurrentRoomStore";
import { showErrorToast } from "../../lib/showErrorToast";
import { useTypeSafePrefetch } from "../../shared-hooks/useTypeSafePrefetch";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { Feed } from "../../ui/Feed";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { CreateRoomModal } from "./CreateRoomModal";

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
  const { push } = useRouter();
  const prefetch = useTypeSafePrefetch("getRoomUsers");

  if (!conn || isLoading || !data) {
    return null;
  }

  return (
    <>
      <Feed
        onRoomClick={(room) => {
          if (room.id !== currentRoom?.id) {
            prefetch([room.id], ["getRoomUsers", room.id]);
          }

          push(`/room/[id]`, `/room/${room.id}`);
        }}
        actionTitle="New room"
        emptyPlaceholder={<div>empty</div>}
        onActionClicked={() => {
          setRoomModal(true);
        }}
        rooms={data.rooms}
        title="Your Feed"
      />
      {roomModal && (
        <CreateRoomModal onRequestClose={() => setRoomModal(false)} />
      )}
    </>
  );
};
