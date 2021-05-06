import React from "react";
import { HeaderController } from "../../modules/display/HeaderController";
import { PageComponent } from "../../types/PageComponent";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";
import { PrivacySettingForm } from "./PrivacySettingForm";

interface ChatSettingsProps {}

export const PrivacySettingsPage: PageComponent<ChatSettingsProps> = () => {
  return (
    <DefaultDesktopLayout>
      <HeaderController embed={{}} title={"Privacy Settings"} />
      <MiddlePanel>
        <h1 className={`pb-4 text-4xl text-primary-100`}>Privacy Settings</h1>

        <PrivacySettingForm />
      </MiddlePanel>
    </DefaultDesktopLayout>
  );
};

PrivacySettingsPage.ws = true;
