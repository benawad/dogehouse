import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { FollowingOnlineController } from "../dashboard/FollowingOnlineController";
import { ProfileBlockController } from "../dashboard/ProfileBlockController";
import { DesktopLayout } from "../layouts/DesktopLayout";
import { LeftPanel, MiddlePanel, RightPanel } from "../layouts/GridPanels";
import { FollowingController } from "./FollowingController";
import { UserProfileController } from "./UserProfileController";

interface UserPageProps {}

export const FollowingPage: PageComponent<UserPageProps> = ({}) => {
  return (
    <WaitForWsAndAuth>
      <DesktopLayout
        leftPanel={<FollowingOnlineController />}
        rightPanel={<ProfileBlockController />}
      >
        <FollowingController />
      </DesktopLayout>
    </WaitForWsAndAuth>
  );
};

FollowingPage.ws = true;
