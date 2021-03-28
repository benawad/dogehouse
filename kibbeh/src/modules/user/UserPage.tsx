import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { FollowingOnlineController } from "../dashboard/FollowingOnlineController";
import { ProfileBlockController } from "../dashboard/ProfileBlockController";
import { DesktopLayout } from "../layouts/DesktopLayout";
import { LeftPanel, MiddlePanel, RightPanel } from "../layouts/GridPanels";
import { UserProfileController } from "./UserProfileController";

interface UserPageProps {}

export const UserPage: PageComponent<UserPageProps> = ({}) => {
  return (
    <WaitForWsAndAuth>
      <DesktopLayout>
        <LeftPanel>
          <FollowingOnlineController />
        </LeftPanel>
        <MiddlePanel>
          <UserProfileController />
        </MiddlePanel>
        <RightPanel>
          <ProfileBlockController />
        </RightPanel>
      </DesktopLayout>
    </WaitForWsAndAuth>
  );
};

UserPage.ws = true;
