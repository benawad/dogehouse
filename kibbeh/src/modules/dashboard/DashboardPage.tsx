import React, { useContext } from "react";
import { PageComponent } from "../../types/PageComponent";
import { MainInnerGrid } from "../../ui/MainGrid";
import Header from "../../ui/Header";
import { useVerifyLoggedIn } from "../auth/useVerifyLoggedIn";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { FeedController } from "./FeedController";
import { FriendsOnlineController } from "./FriendsOnlineController";
import { ProfileBlockController } from "./ProfileBlockController";

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
    <div className={`flex-col items-center w-full`}>
      <div className={`mt-5 mb-7`}>
        <Header
          searchPlaceholder={"Search for rooms, users or categories"}
          onSearchChange={() => null}
          avatarImg={conn.user.avatarUrl}
        />
      </div>
      <MainInnerGrid>
        <FriendsOnlineController />
        <FeedController />
        <ProfileBlockController />
      </MainInnerGrid>
    </div>
  );
};

DashboardPage.ws = true;
