import { Formik } from "formik";
import isElectron from "is-electron";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { object, string } from "superstruct";
import { InputField } from "../../form-fields/InputField";
import { useOverlayStore } from "../../global-stores/useOverlayStore";
import { validateStruct } from "../../lib/validateStruct";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { PageComponent } from "../../types/PageComponent";
import { Button } from "../../ui/Button";
import { OverlayKeybind } from "../keyboard-shortcuts";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";

interface OverlaySettingsProps {}
const overlaySettingsStruct = object({
  appTitle: string(),
});
const validateData = validateStruct(overlaySettingsStruct);
const isMac = process.platform === "darwin";
export const OverlaySettingsPage: PageComponent<OverlaySettingsProps> = () => {
  const { appTitle } = useOverlayStore.getState();
  const { push } = useRouter();
  const { t } = useTypeSafeTranslation();
  useEffect(() => {
    if (!isElectron() || isMac) {
      push("/dash");
    }
  }, [push]);

  return (
    <DefaultDesktopLayout>
      <MiddlePanel>
        <div className="flex-col text-primary-100">
          <OverlayKeybind className={`mb-4`} />
          <Formik
            initialValues={{
              appTitle,
            }}
            validateOnChange={false}
            validate={(values) => {
              return validateData({
                ...values,
                appTitle: values.appTitle.trim(),
              });
            }}
            onSubmit={(data) => {
              useOverlayStore.getState().setData(data);
            }}
          >
            {({ handleSubmit }) => (
              <div>
                <InputField
                  errorMsg={t("pages.overlaySettings.input.errorMsg")}
                  label={t("pages.overlaySettings.input.label")}
                  name="appTitle"
                />
                <div className={`flex mt-12`}>
                  <Button
                    type="button"
                    onClick={() => handleSubmit()}
                    className={`ml-2`}
                  >
                    {t("common.save")}
                  </Button>
                </div>
              </div>
            )}
          </Formik>
        </div>
      </MiddlePanel>
    </DefaultDesktopLayout>
  );
};

OverlaySettingsPage.ws = true;
