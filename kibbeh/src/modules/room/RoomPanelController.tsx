import React, { useState } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useConn } from "../../shared-hooks/useConn";
import { CenterLoader } from "../../ui/CenterLoader";
import { RoomHeader } from "../../ui/RoomHeader";
import { CreateRoomModal } from "../dashboard/CreateRoomModal";
import { MiddlePanel } from "../layouts/GridPanels";
import { RoomPanelIconBarController } from "./RoomPanelIconBarController";
import { RoomUsersPanel } from "./RoomUsersPanel";
import { useGetRoomByQueryParam } from "./useGetRoomByQueryParam";
import { UserPreviewModal } from "./UserPreviewModal";
import { HeaderController } from "../display/HeaderController";
import { useRoomChatStore } from "./chat/useRoomChatStore";
import { useScreenType } from "../../shared-hooks/useScreenType";
import { useBreadcrumb } from "../../global-stores/useBreadcrumb";

interface RoomPanelControllerProps {}

export const RoomPanelController: React.FC<RoomPanelControllerProps> = ({}) => {
  const conn = useConn();
  const { currentRoomId } = useCurrentRoomIdStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const { data, isLoading } = useGetRoomByQueryParam();
  const open = useRoomChatStore((s) => s.open);
  const screenType = useScreenType();
  const setCurrentRoom = useBreadcrumb((state) => state.setCurrentRoom);

  if (isLoading || !currentRoomId) {
    return (
      <>
        <MiddlePanel>
          <CenterLoader />
        </MiddlePanel>
      </>
    );
  }

  if (!data || "error" in data) {
    return null;
  }

  const roomCreator = data.users.find((x) => x.id === data.room.creatorId);

  setCurrentRoom(data.room);

  return (
    <>
      {showEditModal ? (
        <CreateRoomModal
          onRequestClose={() => setShowEditModal(false)}
          edit
          data={{
            name: data.room.name,
            description: data.room.description || "",
            privacy: data.room.isPrivate ? "private" : "public",
          }}
        />
      ) : null}
      <HeaderController embed={{}} title={data.room.name} />
      <MiddlePanel
        stickyChildren={
          <RoomHeader
            onTitleClick={
              data.room.creatorId === conn.user.id
                ? () => setShowEditModal(true)
                : undefined
            }
            title={data.room.name}
            description={data.room.description || ""}
            names={roomCreator ? [roomCreator.username] : []}
          />
        }
      >
        <UserPreviewModal {...data} />
        {screenType === "fullscreen" && open ? null : (
          <RoomUsersPanel {...data} />
        )}
        <div
          className={`sticky bottom-0 pb-7 bg-primary-900 ${
            (screenType === "fullscreen" || screenType === "1-cols") && open
              ? "flex-1"
              : ""
          }`}
        >
          <RoomPanelIconBarController {...data} />
        </div>
      </MiddlePanel>
    </>
  );
};
