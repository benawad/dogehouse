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
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";

interface UserPageProps {}

export const FollowingPage: PageComponent<UserPageProps> = ({}) => {
  const { t } = useTypeSafeTranslation();
  return (
    <WaitForWsAndAuth>
      <HeaderController embed={{}} title={t("pages.followList.title")} />
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
