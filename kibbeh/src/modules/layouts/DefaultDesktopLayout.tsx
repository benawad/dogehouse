import React from "react";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { FollowingOnlineController } from "../dashboard/FollowingOnlineController";
import { ProfileBlockController } from "../dashboard/ProfileBlockController";
import { DesktopLayout } from "./DesktopLayout";
import { LeftPanel, RightPanel } from "./GridPanels";

interface DefaultDesktopLayoutProps {}

export const DefaultDesktopLayout: React.FC<DefaultDesktopLayoutProps> = ({
  children,
}) => {
  return (
    <WaitForWsAndAuth>
      <DesktopLayout>
        <LeftPanel>
          <FollowingOnlineController />
        </LeftPanel>
        {children}
        <RightPanel>
          <ProfileBlockController />
        </RightPanel>
      </DesktopLayout>
    </WaitForWsAndAuth>
  );
};
