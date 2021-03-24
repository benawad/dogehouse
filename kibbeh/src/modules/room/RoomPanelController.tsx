import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { isUuid } from "../../lib/isUuid";
import { showErrorToast } from "../../lib/showErrorToast";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { RoomHeader } from "../../ui/RoomHeader";
import { Spinner } from "../../ui/Spinner";
import { MiddlePanel, RightPanel } from "../layouts/GridPanels";
import { RoomChat } from "./chat/RoomChat";
import { RoomPanelIconBarController } from "./RoomPanelIconBarController";
import { RoomUsersPanel } from "./RoomUsersPanel";
import { UserPreviewModal } from "./UserPreviewModal";

interface RoomPanelControllerProps {}

export const RoomPanelController: React.FC<RoomPanelControllerProps> = ({}) => {
  const { currentRoomId, setCurrentRoomId } = useCurrentRoomIdStore();
  const { query } = useRouter();
  const roomId = typeof query.id === "string" ? query.id : "";
  const { data, isLoading } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", currentRoomId || ""],
    {
      enabled: isUuid(roomId),
      onSuccess: ((d: JoinRoomAndGetInfoResponse | { error: string }) => {
        if (!("error" in d)) {
          setCurrentRoomId(() => d.room.id);
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
      setCurrentRoomId(null);
      push("/dashboard");
      return;
    }
    if ("error" in data) {
      setCurrentRoomId(null);
      showErrorToast(data.error);
      push("/dashboard");
    }
  }, [data, isLoading, push, setCurrentRoomId]);

  if (isLoading || !currentRoomId) {
    return <Spinner />;
  }

  if (!data || "error" in data) {
    return null;
  }

  const roomCreator = data.users.find((x) => x.id === data.room.creatorId);

  return (
    <>
      <MiddlePanel
        stickyChildren={
          <RoomHeader
            title={data.room.name}
            description={data.room.description || ""}
            names={roomCreator ? [roomCreator.username] : []}
          />
        }
      >
        <UserPreviewModal {...data} />
        <RoomUsersPanel {...data} />
        <div className={`sticky bottom-0 pb-7 bg-primary-900`}>
          <RoomPanelIconBarController />
        </div>
      </MiddlePanel>
      <RightPanel>
        <RoomChat room={data.room} users={data.users} />
      </RightPanel>
    </>
  );
};
