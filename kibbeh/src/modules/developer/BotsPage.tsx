import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { HeaderController } from "../display/HeaderController";
import { MainLayout } from "../layouts/MainLayout";
import { FloatingRoomInfo } from "../layouts/FloatingRoomInfo";
import { TabletSidebar } from "../layouts/TabletSidebar";
import { DeveloperPanel } from "./DeveloperPanel";
import { ProfileBlockController } from "../dashboard/ProfileBlockController";
import { YourBots } from "./YourBots";

export const BotsPage: PageComponent<unknown> = ({}) => {
  return (
    <WaitForWsAndAuth>
      <HeaderController embed={{}} title={"Bots"} />
      <MainLayout
        floatingRoomInfo={<FloatingRoomInfo />}
        tabletSidebar={<TabletSidebar />}
        leftPanel={<DeveloperPanel />}
        rightPanel={<ProfileBlockController />}
        mobileHeader={undefined}
      >
        <YourBots />
      </MainLayout>
    </WaitForWsAndAuth>
  );
};

BotsPage.ws = true;
