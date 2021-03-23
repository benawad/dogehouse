import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useCurrentRoomStore } from "../../global-stores/useCurrentRoomStore";
import { isUuid } from "../../lib/isUuid";
import { showErrorToast } from "../../lib/showErrorToast";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { ErrorToast } from "../../ui/ErrorToast";
import { RoomHeader } from "../../ui/RoomHeader";
import { Spinner } from "../../ui/Spinner";
import { RoomUsersPanel } from "./RoomUsersPanel";
import { UserPreviewModal } from "./UserPreviewModal";
import { UserPreviewModalProvider } from "./UserPreviewModalProvider";

interface RoomPanelControllerProps {}

export const RoomPanelController: React.FC<RoomPanelControllerProps> = ({}) => {
  const { currentRoom, setCurrentRoom } = useCurrentRoomStore();
  const { query } = useRouter();
  const roomId = typeof query.id === "string" ? query.id : "";
  const { data, isLoading } = useTypeSafeQuery(
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
  const { push } = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!data) {
      push("/dashboard");
      return;
    }
    if ("error" in data) {
      showErrorToast(data.error);
      push("/dashboard");
    }
  }, [data, isLoading, push]);

  if (isLoading || !currentRoom) {
    return <Spinner />;
  }

  if (!data || "error" in data) {
    return null;
  }

  const roomCreator = data?.users.find((x) => x.id === currentRoom.creatorId);

  return (
    <div className={`w-full flex-col`}>
      <UserPreviewModal {...data} />
      <RoomHeader
        title={currentRoom.name}
        description={currentRoom.description || ""}
        names={roomCreator ? [roomCreator.username] : []}
      />
      <RoomUsersPanel {...data} />
    </div>
  );
};
