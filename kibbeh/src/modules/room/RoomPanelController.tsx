import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import React, { useState } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useConn } from "../../shared-hooks/useConn";
import { useScreenType } from "../../shared-hooks/useScreenType";
import { CenterLoader } from "../../ui/CenterLoader";
import { RoomHeader } from "../../ui/RoomHeader";
import { CreateRoomModal } from "../dashboard/CreateRoomModal";
import { HeaderController } from "../display/HeaderController";
import { MiddlePanel } from "../layouts/GridPanels";
import { useRoomChatStore } from "./chat/useRoomChatStore";
import { RoomPanelIconBarController } from "./RoomPanelIconBarController";
import { RoomUsersPanel } from "./RoomUsersPanel";
import { useGetRoomByQueryParam } from "./useGetRoomByQueryParam";
import { UserPreviewModal } from "./UserPreviewModal";

interface RoomPanelControllerProps {
  setRoomData?: React.Dispatch<
    React.SetStateAction<JoinRoomAndGetInfoResponse | undefined>
  >;
  showMobileEditModal: boolean;
  setShowMobileEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RoomPanelController: React.FC<RoomPanelControllerProps> = ({
  setRoomData,
  showMobileEditModal,
  setShowMobileEditModal,
}) => {
  const conn = useConn();
  const { currentRoomId } = useCurrentRoomIdStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const { data, isLoading } = useGetRoomByQueryParam();
  const open = useRoomChatStore((s) => s.open);
  const screenType = useScreenType();

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

  const roomCreator = data.users.find((x: any) => x.id === data.room.creatorId);
  if (setRoomData) setRoomData(data);

  return (
    <>
      {showEditModal || showMobileEditModal ? (
        <CreateRoomModal
          onRequestClose={() => {
            setShowEditModal(false);
            setShowMobileEditModal(false);
          }}
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
          screenType !== "fullscreen" ? (
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
          ) : (
            ""
          )
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
