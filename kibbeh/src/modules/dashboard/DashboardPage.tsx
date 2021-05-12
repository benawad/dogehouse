import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { HeaderController } from "../display/HeaderController";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { FeedController } from "./FeedController";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";

interface LoungePageProps {}

export const DashboardPage: PageComponent<LoungePageProps> = ({}) => {
  const { t } = useTypeSafeTranslation();
  return (
    <WaitForWsAndAuth>
      <HeaderController embed={{}} title={t("header.dashboard")} />
      <DefaultDesktopLayout>
        <FeedController />
      </DefaultDesktopLayout>
    </WaitForWsAndAuth>
  );
};

DashboardPage.ws = true;
