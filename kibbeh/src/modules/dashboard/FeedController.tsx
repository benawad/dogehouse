import { wrap, GetTopPublicRoomsResponse } from "@dogehouse/kebab";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { Feed } from "../../ui/Feed";
import { WebSocketContext } from "../ws/WebSocketProvider";

interface FeedControllerProps {}

export const FeedController: React.FC<FeedControllerProps> = ({}) => {
  const { conn } = useContext(WebSocketContext);
  const { isLoading, data } = useTypeSafeQuery("getTopPublicRooms", {
    staleTime: Infinity,
    enabled: !!conn,
    refetchOnMount: "always",
    refetchInterval: 10000,
  });

  if (!conn || isLoading || !data) {
    return null;
  }

  return (
    <Feed
      actionTitle="New room"
      emptyPlaceholder={<div>empty</div>}
      onActionClicked={() => {}}
      rooms={data.rooms}
      title="Your Feed"
    />
  );
};
