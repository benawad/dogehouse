import { wrap, GetTopPublicRoomsResponse } from "@dogehouse/kebab";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { Feed } from "../../ui/Feed";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { CreateRoomModal } from "./CreateRoomModal";

interface FeedControllerProps {}

export const FeedController: React.FC<FeedControllerProps> = ({}) => {
  const { conn } = useContext(WebSocketContext);
  const { isLoading, data } = useTypeSafeQuery("getTopPublicRooms", {
    staleTime: Infinity,
    enabled: !!conn,
    refetchOnMount: "always",
    refetchInterval: 10000,
  });
  const [roomModal, setRoomModal] = useState(false);

  if (!conn || isLoading || !data) {
    return null;
  }

  return (
    <>
      <Feed
        actionTitle="New room"
        emptyPlaceholder={<div>empty</div>}
        onActionClicked={(t) => setRoomModal(true)}
        rooms={data.rooms}
        title="Your Feed"
      />
      {roomModal && (
        <CreateRoomModal onRequestClose={() => setRoomModal(false)} />
      )}
    </>
  );
};
