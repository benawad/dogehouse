import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useTypeSafePrefetch } from "../../shared-hooks/useTypeSafePrefetch";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { Feed, FeedHeader } from "../../ui/Feed";
import { MiddlePanel } from "../layouts/GridPanels";
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
  const { currentRoomId } = useCurrentRoomIdStore();
  const { push } = useRouter();
  const prefetch = useTypeSafePrefetch();

  if (!conn || isLoading || !data) {
    return null;
  }

  return (
    <MiddlePanel
      stickyChildren={
        <FeedHeader
          actionTitle="New room"
          onActionClicked={() => {
            setRoomModal(true);
          }}
          title="Your Feed"
        />
      }
    >
      <Feed
        onRoomClick={(room) => {
          if (room.id !== currentRoomId) {
            prefetch(["joinRoomAndGetInfo", room.id], [room.id]);
          }

          push(`/room/[id]`, `/room/${room.id}`);
        }}
        emptyPlaceholder={<div>empty</div>}
        rooms={data.rooms}
      />
      {roomModal && (
        <CreateRoomModal onRequestClose={() => setRoomModal(false)} />
      )}
    </MiddlePanel>
  );
};
