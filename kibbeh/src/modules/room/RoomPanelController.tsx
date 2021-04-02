import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { isServer } from "../../lib/isServer";
import { isUuid } from "../../lib/isUuid";
import { showErrorToast } from "../../lib/showErrorToast";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { CenterLoader } from "../../ui/CenterLoader";
import { RoomHeader } from "../../ui/RoomHeader";
import { Spinner } from "../../ui/Spinner";
import { CreateRoomModal } from "../dashboard/CreateRoomModal";
import { MiddlePanel, RightPanel } from "../layouts/GridPanels";
import { RoomChat } from "./chat/RoomChat";
import { RoomPanelIconBarController } from "./RoomPanelIconBarController";
import { RoomUsersPanel } from "./RoomUsersPanel";
import { useGetRoomByQueryParam } from "./useGetRoomByQueryParam";
import { UserPreviewModal } from "./UserPreviewModal";

interface RoomPanelControllerProps {}

export const RoomPanelController: React.FC<RoomPanelControllerProps> = ({}) => {
  const { currentRoomId } = useCurrentRoomIdStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const { data, isLoading } = useGetRoomByQueryParam();

  if (isLoading || !currentRoomId) {
    return (
      <>
        <MiddlePanel>
          <CenterLoader />
        </MiddlePanel>
        <RightPanel />
      </>
    );
  }

  if (!data || "error" in data) {
    return null;
  }

  const roomCreator = data.users.find((x) => x.id === data.room.creatorId);

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
      <MiddlePanel
        stickyChildren={
          <RoomHeader
            onTitleClick={() => setShowEditModal(true)}
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
