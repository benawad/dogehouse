import { JoinRoomAndGetInfoResponse, Room } from "@dogehouse/kebab";
import router, { useRouter } from "next/router";
import React, { useState } from "react";
import { validate } from "uuid";
import { isServer } from "../../lib/isServer";
import { defaultQueryFn } from "../../lib/defaultQueryFn";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { FollowingOnlineController } from "../dashboard/FollowingOnlineController";
import { MainLayout } from "../layouts/MainLayout";
import { TabletSidebar } from "../layouts/TabletSidebar";
import { RoomChatController } from "./RoomChatController";
import { RoomOpenGraphPreview } from "./RoomOpenGraphPreview";
import { RoomPanelController } from "./RoomPanelController";
import { UserPreviewModalProvider } from "./UserPreviewModalProvider";
import { PageHeader } from "../../ui/mobile/MobileHeader";
import { useLeaveRoom } from "../../shared-hooks/useLeaveRoom";
import { useConn } from "../../shared-hooks/useConn";

interface RoomPageProps {
  room?: Room;
}

export const RoomPage: PageComponent<RoomPageProps> = ({ room }) => {
  const { query, back } = useRouter();
  const key = typeof query.id === "string" ? query.id : "";
  const { leaveRoom } = useLeaveRoom();
  const conn = useConn();
  const [roomData, setRoomData] = useState(
    undefined as JoinRoomAndGetInfoResponse | undefined
  );
  const [showMobileEditModal, setShowMobileEditModal] = useState(false);

  return (
    <RoomOpenGraphPreview room={room}>
      <WaitForWsAndAuth>
        <UserPreviewModalProvider>
          <MainLayout
            floatingRoomInfo={null}
            tabletSidebar={<TabletSidebar />}
            leftPanel={<FollowingOnlineController />}
            rightPanel={<RoomChatController />}
            mobileHeader={
              <PageHeader
                title={
                  <>
                    <div
                      className="text-center absolute flex flex-col left-1/2 top-1/2 transform translate-x-n1/2 translate-y-n1/2 w-3/5"
                      onClick={() => roomData?.room.creatorId === conn.user.id ? setShowMobileEditModal(true) : ""}
                    >
                      <span className="line-clamp-1">{roomData?.room.name}</span>
                      {roomData && (
                        <span
                          className={"text-sm text-center font-normal truncate"}
                        >
                          with{" "}
                          <span className={"font-bold truncate"}>
                            {
                              roomData?.users.find(
                                (x: any) => x.id === roomData?.room.creatorId
                              )?.username
                            }
                          </span>
                        </span>
                      )}
                    </div>
                    <button
                      className={
                        "absolute right-3 top-1/2 transform translate-y-n1/2 font-bold text-accent"
                      }
                      style={{ fontSize: "14px" }}
                      onClick={() => {
                        router.push("/dash");
                        leaveRoom();
                      }}
                    >
                      Leave
                    </button>
                  </>
                }
                onBackClick={() => back()}
              />
            }
          >
            <RoomPanelController
              key={key}
              setRoomData={setRoomData}
              showMobileEditModal={showMobileEditModal}
              setShowMobileEditModal={setShowMobileEditModal}
            />
          </MainLayout>
        </UserPreviewModalProvider>
      </WaitForWsAndAuth>
    </RoomOpenGraphPreview>
  );
};

RoomPage.ws = true;
// ssr
RoomPage.getInitialProps = async ({ query }) => {
  const key =
    typeof query.id === "string" && validate(query.id) ? query.id : "";
  let room = null;

  if (isServer && key) {
    try {
      const resp = await defaultQueryFn({ queryKey: `/room/${key}` });
      if ("room" in resp) {
        room = resp.room;
      }
    } catch {}
  }

  return { room };
};
