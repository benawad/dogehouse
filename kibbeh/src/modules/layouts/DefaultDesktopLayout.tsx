import React from "react";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { FollowingOnlineController } from "../dashboard/FollowingOnlineController";
import { ProfileBlockController } from "../dashboard/ProfileBlockController";
import { DesktopLayout } from "./DesktopLayout";

interface DefaultDesktopLayoutProps {}

export const DefaultDesktopLayout: React.FC<DefaultDesktopLayoutProps> = ({
  children,
}) => {
  return (
    <WaitForWsAndAuth>
      <DesktopLayout
        leftPanel={<FollowingOnlineController />}
        rightPanel={<ProfileBlockController />}
      >
        {children}
      </DesktopLayout>
    </WaitForWsAndAuth>
  );
};
