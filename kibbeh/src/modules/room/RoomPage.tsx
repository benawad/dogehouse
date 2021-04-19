import { useRouter } from "next/router";
import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { FollowingOnlineController } from "../dashboard/FollowingOnlineController";
import { DesktopLayout } from "../layouts/DesktopLayout";
import { LeftPanel } from "../layouts/GridPanels";
import { TabletSidebar } from "../layouts/TabletSidebar";
import { RoomChatController } from "./RoomChatController";
import { RoomPanelController } from "./RoomPanelController";
import { UserPreviewModalProvider } from "./UserPreviewModalProvider";

interface RoomPageProps {}

export const RoomPage: PageComponent<RoomPageProps> = ({}) => {
  const { query } = useRouter();
  const key = typeof query.id === "string" ? query.id : "";
  return (
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
  );
};

RoomPage.ws = true;
