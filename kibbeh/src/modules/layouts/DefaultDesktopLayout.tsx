import isElectron from "is-electron";
import React from "react";
import { useHostStore } from "../../global-stores/useHostStore";
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
      {isElectron() && !useHostStore.getState().isLinux ? (
        <ElectronHeader />
      ) : null}
      <div
        className={
          isElectron() && !useHostStore.getState().isLinux
            ? "default-desktop-layout flex flex-col items-center w-full scrollbar-thin scrollbar-thumb-primary-700"
            : "flex flex-col items-center w-full scrollbar-thin scrollbar-thumb-primary-700"
        }
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
