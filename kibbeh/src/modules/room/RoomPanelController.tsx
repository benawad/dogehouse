import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import React from "react";
import { useCurrentRoomStore } from "../../global-stores/useCurrentRoomStore";
import { isUuid } from "../../lib/isUuid";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { ErrorToast } from "../../ui/ErrorToast";
import { RoomHeader } from "../../ui/RoomHeader";
import { RoomUsersPanel } from "./RoomUsersPanel";

interface RoomPanelControllerProps {}

export const RoomPanelController: React.FC<RoomPanelControllerProps> = ({}) => {
  const { currentRoom, setCurrentRoom } = useCurrentRoomStore();
  const { query } = useRouter();
  const roomId = typeof query.id === "string" ? query.id : "";
  const { data } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", currentRoom?.id || ""],
    {
      enabled: isUuid(roomId),
      onSuccess: ((d: JoinRoomAndGetInfoResponse | { error: string }) => {
        if (!("error" in d)) {
          setCurrentRoom(() => d.room);
        }
      }) as any,
    },
    [roomId]
  );

  if (!data) {
    // @todo add error handling
    return null;
  }

  // @todo start using error codes
  if ("error" in data) {
    // @todo replace with real design
    return (
      <div>
        <ErrorToast message={data.error} />
      </div>
    );
  }

  if (!currentRoom) {
    return null;
  }

  const roomCreator = data?.users.find((x) => x.id === currentRoom.creatorId);

  return (
    <div className={`w-full flex-col`}>
      <RoomHeader
        title={currentRoom.name}
        description={currentRoom.description || ""}
        names={roomCreator ? [roomCreator.username] : []}
      />
      <RoomUsersPanel {...data} />
    </div>
  );
};
