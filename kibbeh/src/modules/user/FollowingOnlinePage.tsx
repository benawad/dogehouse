import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { FollowingOnlineController } from "../dashboard/FollowingOnlineController";
import { ProfileBlockController } from "../dashboard/ProfileBlockController";
import { LeftPanel, MiddlePanel, RightPanel } from "../layouts/GridPanels";
import { HeaderController } from "../../modules/display/HeaderController";
import { MainLayout } from "../layouts/MainLayout";
import { FollowersOnlineWrapper } from "../../ui/FollowersOnline";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";

interface UserPageProps {}

export const FollowingOnlinePage: PageComponent<UserPageProps> = ({}) => {
  const { t } = useTypeSafeTranslation();
  return (
    <WaitForWsAndAuth>
      <HeaderController embed={{}} title={t("pages.followingOnlineList.title")} />
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
