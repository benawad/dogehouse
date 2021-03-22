import React, { useContext } from "react";
import { PageComponent } from "../../types/PageComponent";
import { useVerifyLoggedIn } from "../auth/useVerifyLoggedIn";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { DesktopLayout } from "../layouts/DesktopLayout";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { FeedController } from "./FeedController";
import { FollowingOnlineController } from "./FollowingOnlineController";
import { ProfileBlockController } from "./ProfileBlockController";

interface LoungePageProps {}

export const DashboardPage: PageComponent<LoungePageProps> = ({}) => {
  return (
    <WaitForWsAndAuth>
      <DesktopLayout>
        <FollowingOnlineController />
        <FeedController />
        <ProfileBlockController />
      </DesktopLayout>
    </WaitForWsAndAuth>
  );
};

DashboardPage.ws = true;
