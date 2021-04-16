import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { HeaderController } from "../display/HeaderController";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { ScheduledRoomsList } from "./ScheduledRoomsList";

interface LoungePageProps {}

export const ScheduledRoomsPage: PageComponent<LoungePageProps> = ({}) => {
  return (
    <WaitForWsAndAuth>
      <HeaderController embed={{}} title="Scheduled Rooms" />
      <DefaultDesktopLayout>
        <ScheduledRoomsList />
      </DefaultDesktopLayout>
    </WaitForWsAndAuth>
  );
};

ScheduledRoomsPage.ws = true;
