import React from "react";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { FollowingOnlineController } from "../dashboard/FollowingOnlineController";
import { ProfileBlockController } from "../dashboard/ProfileBlockController";
import { MainLayout } from "./MainLayout";
import { FloatingRoomInfo } from "./FloatingRoomInfo";
import { TabletSidebar } from "./TabletSidebar";

interface DefaultDesktopLayoutProps {
  mobileHeader?: React.ReactNode
}

export const DefaultDesktopLayout: React.FC<DefaultDesktopLayoutProps> = ({
  children,
  mobileHeader = undefined,
}) => {
  return (
    <WaitForWsAndAuth>
      <MainLayout
        floatingRoomInfo={<FloatingRoomInfo />}
        tabletSidebar={<TabletSidebar />}
        leftPanel={<FollowingOnlineController />}
        rightPanel={<ProfileBlockController />}
        mobileHeader={mobileHeader}
      >
        {children}
      </MainLayout>
    </WaitForWsAndAuth>
  );
};
