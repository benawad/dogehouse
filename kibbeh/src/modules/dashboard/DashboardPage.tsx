import React, { useContext } from "react";
import { PageComponent } from "../../types/PageComponent";
import { MainInnerGrid } from "../../ui/MainGrid";
import Header from "../../ui/Header";
import { useVerifyLoggedIn } from "../auth/useVerifyLoggedIn";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { FeedController } from "./FeedController";
import { FriendsOnlineController } from "./FriendsOnlineController";
import { ProfileBlockController } from "./ProfileBlockController";
import { HeaderController } from "../header/HeaderController";
import { DesktopLayout } from "../layouts/DesktopLayout";

interface LoungePageProps {}

export const DashboardPage: PageComponent<LoungePageProps> = ({}) => {
  const { conn } = useContext(WebSocketContext);

  if (!useVerifyLoggedIn()) {
    return null;
  }

  if (!conn) {
    // @todo make this better
    return <div>loading...</div>;
  }

  return (
    <DesktopLayout>
      <FriendsOnlineController />
      <FeedController />
      <ProfileBlockController />
    </DesktopLayout>
  );
};

DashboardPage.ws = true;
