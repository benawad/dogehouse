import React from "react";
import router from "next/router";
import { PageComponent } from "../../types/PageComponent";
import { LanguageSelector } from "../../ui/LanguageSelector";
import { PageHeader } from "../../ui/mobile/MobileHeader";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { HeaderController } from "../display/HeaderController";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { useScreenType } from "../../shared-hooks/useScreenType";

interface LanguagePageProps {}

// This is temp until we have the settings page up and running
export const LanguagePage: PageComponent<LanguagePageProps> = () => {
  const screenType = useScreenType();
  if (screenType !== "fullscreen") router.push("/dash");

  return (
    <WaitForWsAndAuth>
      <HeaderController embed={{}} title="Language" />
      <DefaultDesktopLayout
        mobileHeader={
          <PageHeader title="Language" onBackClick={() => router.back()} />
        }
      >
        <div className="h-full w-full">
          <LanguageSelector mobile />
        </div>
      </DefaultDesktopLayout>
    </WaitForWsAndAuth>
  );
};

LanguagePage.ws = true;
