import { Room } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import React from "react";
import { validate } from "uuid";
import { isServer } from "../../lib/isServer";
import { defaultQueryFn } from "../../lib/defaultQueryFn";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { FollowingOnlineController } from "../dashboard/FollowingOnlineController";
import { DesktopLayout } from "../layouts/DesktopLayout";
import { TabletSidebar } from "../layouts/TabletSidebar";
import { RoomChatController } from "./RoomChatController";
import { RoomOpenGraphPreview } from "./RoomOpenGraphPreview";
import { RoomPanelController } from "./RoomPanelController";
import { UserPreviewModalProvider } from "./UserPreviewModalProvider";

interface RoomPageProps {
  room?: Room;
}

export const RoomPage: PageComponent<RoomPageProps> = ({ room }) => {
  const { query } = useRouter();
  const key = typeof query.id === "string" ? query.id : "";

  return (
    <RoomOpenGraphPreview room={room}>
      <WaitForWsAndAuth>
        <UserPreviewModalProvider>
          <DesktopLayout
            floatingRoomInfo={null}
            tabletSidebar={<TabletSidebar />}
            leftPanel={<FollowingOnlineController />}
            rightPanel={<RoomChatController />}
          >
            <RoomPanelController key={key} />
          </DesktopLayout>
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
