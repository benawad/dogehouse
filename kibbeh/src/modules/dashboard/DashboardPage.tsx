import React, { useContext } from "react";
import { PageComponent } from "../../types/PageComponent";
import { DashboardInnerGrid } from "../../ui/DashboardGrid";
import { FriendsOnline } from "../../ui/FriendsOnline";
import Header from "../../ui/Header";
import { ProfileBlock } from "../../ui/ProfileBlock";
import { UpcomingRoomsCard } from "../../ui/UpcomingRoomsCard";
import { UserSummaryCard } from "../../ui/UserSummaryCard";
import { useVerifyLoggedIn } from "../auth/useVerifyLoggedIn";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { FeedController } from "./FeedController";

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
      <DashboardInnerGrid>
        <FriendsOnline onlineFriendCount={0} onlineFriendList={[]} />
        <FeedController />
        <ProfileBlock
          top={
            <UserSummaryCard
              badges={[]}
              website=""
              isOnline={false}
              {...conn.user}
              username={"@" + conn.user.username}
            />
          }
          bottom={<UpcomingRoomsCard rooms={[]} />}
        />
      </DashboardInnerGrid>
    </div>
  );
};

DashboardPage.ws = true;
