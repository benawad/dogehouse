import React from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { RoomChat } from "./chat/RoomChat";

interface RoomChatControllerProps {}

export const RoomChatController: React.FC<RoomChatControllerProps> = ({}) => {
  const { currentRoomId } = useCurrentRoomIdStore();
  const { data } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", currentRoomId || ""],
    {
      enabled: false,
    },
    [currentRoomId || ""]
  );

  if (!data || "error" in data) {
    return null;
  }

  return <RoomChat {...data} />;
};
