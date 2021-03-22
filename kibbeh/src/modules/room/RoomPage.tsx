import { useRouter } from "next/router";
import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { FollowingOnlineController } from "../dashboard/FollowingOnlineController";
import { DesktopLayout } from "../layouts/DesktopLayout";
import { RoomPanelController } from "./RoomPanelController";

interface RoomPageProps {}

export const RoomPage: PageComponent<RoomPageProps> = ({}) => {
  return (
    <WaitForWsAndAuth>
      <DesktopLayout>
        <FollowingOnlineController />
        <RoomPanelController />
        <div />
      </DesktopLayout>
    </WaitForWsAndAuth>
  );
};

RoomPage.ws = true;
