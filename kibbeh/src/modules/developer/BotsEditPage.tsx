import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { HeaderController } from "../display/HeaderController";
import { MainLayout } from "../layouts/MainLayout";
import { FloatingRoomInfo } from "../layouts/FloatingRoomInfo";
import { TabletSidebar } from "../layouts/TabletSidebar";
import { DeveloperPanel } from "./DeveloperPanel";
import { ProfileBlockController } from "../dashboard/ProfileBlockController";
import { EditBot } from "./EditBot";

interface BotsEditPageProps {}

export const BotsEditPage: PageComponent<BotsEditPageProps> = ({}) => {
  return (
    <WaitForWsAndAuth>
      <HeaderController embed={{}} title={"Edit Bot"} />
      <MainLayout
        floatingRoomInfo={<FloatingRoomInfo />}
        tabletSidebar={<TabletSidebar />}
        leftPanel={<DeveloperPanel />}
        rightPanel={<ProfileBlockController />}
        mobileHeader={undefined}
      >
        <EditBot />
      </MainLayout>
    </WaitForWsAndAuth>
  );
};

BotsEditPage.ws = true;
