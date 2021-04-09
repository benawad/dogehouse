import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { InfoText } from "../../ui/InfoText";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { HeaderController } from "../display/HeaderController";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";

interface LoungePageProps {}

export const ScheduledRoomsPage: PageComponent<LoungePageProps> = ({}) => {
  return (
    <WaitForWsAndAuth>
      <HeaderController embed={{}} title="Scheduled Rooms" />
      <DefaultDesktopLayout>
        <MiddlePanel>
          <InfoText>coming soon</InfoText>
        </MiddlePanel>
      </DefaultDesktopLayout>
    </WaitForWsAndAuth>
  );
};

ScheduledRoomsPage.ws = true;
