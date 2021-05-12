import React from "react";
import { HeaderController } from "../../modules/display/HeaderController";
import { PageComponent } from "../../types/PageComponent";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";
import { PrivacySettingForm } from "./PrivacySettingForm";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";

interface ChatSettingsProps {}

export const PrivacySettingsPage: PageComponent<ChatSettingsProps> = () => {
  const { t } = useTypeSafeTranslation();
  return (
    <DefaultDesktopLayout>
      <HeaderController embed={{}} title={t("pages.privacySettings.title")} />
      <MiddlePanel>
        <h1 className={`pb-4 text-4xl text-primary-100`}>
          {t("pages.privacySettings.header")}
        </h1>

        <PrivacySettingForm />
      </MiddlePanel>
    </DefaultDesktopLayout>
  );
};

PrivacySettingsPage.ws = true;
