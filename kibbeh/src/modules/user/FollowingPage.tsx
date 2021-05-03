import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { FollowingOnlineController } from "../dashboard/FollowingOnlineController";
import { ProfileBlockController } from "../dashboard/ProfileBlockController";
import { LeftPanel, MiddlePanel, RightPanel } from "../layouts/GridPanels";
import { FollowingController } from "./FollowingController";
import { UserProfileController } from "./UserProfileController";
import { HeaderController } from "../../modules/display/HeaderController";
import { MainLayout } from "../layouts/MainLayout";

interface UserPageProps {}

export const FollowingPage: PageComponent<UserPageProps> = ({}) => {
  return (
    <WaitForWsAndAuth>
      <HeaderController embed={{}} title="People" />
      <MainLayout
        leftPanel={<FollowingOnlineController />}
        rightPanel={<ProfileBlockController />}
      >
        <FollowingController />
      </MainLayout>
    </WaitForWsAndAuth>
  );
};

FollowingPage.ws = true;
