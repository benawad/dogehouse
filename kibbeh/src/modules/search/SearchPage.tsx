import router from "next/router";
import React from "react";
import { useScreenType } from "../../shared-hooks/useScreenType";
import { PageComponent } from "../../types/PageComponent";
import { PageHeader } from "../../ui/mobile/MobileHeader";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { HeaderController } from "../display/HeaderController";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { SearchBarController } from "./SearchBarController";

interface LoungePageProps {}

export const SearchPage: PageComponent<LoungePageProps> = ({}) => {
  const screenType = useScreenType();
  if(screenType !== "fullscreen") router.push('/dash');
  return (
    <WaitForWsAndAuth>
      <HeaderController embed={{}} title="Search" />
      <DefaultDesktopLayout
        mobileHeader={
          <PageHeader title={"Search"} onBackClick={() => router.back()} />
        }
      >
      <div className="mt-5 w-full">
          <SearchBarController />
        </div>
      </DefaultDesktopLayout>
    </WaitForWsAndAuth>
  );
};

SearchPage.ws = true;
