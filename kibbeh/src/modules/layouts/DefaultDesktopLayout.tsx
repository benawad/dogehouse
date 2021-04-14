import isElectron from "is-electron";
import React from "react";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { FollowingOnlineController } from "../dashboard/FollowingOnlineController";
import { ProfileBlockController } from "../dashboard/ProfileBlockController";
import { DesktopLayout } from "./DesktopLayout";
import { ElectronHeader } from "./ElectronHeader";
import { FloatingRoomInfo } from "./FloatingRoomInfo";
import { TabletSidebar } from "./TabletSidebar";

interface DefaultDesktopLayoutProps {}

export const DefaultDesktopLayout: React.FC<DefaultDesktopLayoutProps> = ({
  children,
}) => {
  return (
    <WaitForWsAndAuth>
      {!isElectron() ? <ElectronHeader /> : null}
      <div
        className={!isElectron() ? "default-desktop-layout w-full" : "w-full"}
      >
        <DesktopLayout
          floatingRoomInfo={<FloatingRoomInfo />}
          tabletSidebar={<TabletSidebar />}
          leftPanel={<FollowingOnlineController />}
          rightPanel={<ProfileBlockController />}
        >
          {children}
        </DesktopLayout>
      </div>
    </WaitForWsAndAuth>
  );
};
