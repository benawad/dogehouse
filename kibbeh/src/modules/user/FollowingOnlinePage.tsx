import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { FollowingOnlineController } from "../dashboard/FollowingOnlineController";
import { ProfileBlockController } from "../dashboard/ProfileBlockController";
import { LeftPanel, MiddlePanel, RightPanel } from "../layouts/GridPanels";
import { HeaderController } from "../../modules/display/HeaderController";
import { MainLayout } from "../layouts/MainLayout";
import { FollowersOnlineWrapper } from "../../ui/FollowersOnline";

interface UserPageProps {}

export const FollowingOnlinePage: PageComponent<UserPageProps> = ({}) => {
  return (
    <WaitForWsAndAuth>
      <HeaderController embed={{}} title="People" />
      <MainLayout
        leftPanel={<FollowingOnlineController />}
        rightPanel={<ProfileBlockController />}
      >
        <div className="mt-4">
          <FollowingOnlineController></FollowingOnlineController>
        </div>
      </MainLayout>
    </WaitForWsAndAuth>
  );
};

FollowingOnlinePage.ws = true;
