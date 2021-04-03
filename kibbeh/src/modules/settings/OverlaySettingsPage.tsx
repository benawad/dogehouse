import { Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { object, string } from "superstruct";
import { InputField } from "../../form-fields/InputField";
import { useGlobalVolumeStore } from "../../global-stores/useGlobalVolumeStore";
import { useOverlayStore } from "../../global-stores/useOverlayStore";
import { validateStruct } from "../../lib/validateStruct";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { PageComponent } from "../../types/PageComponent";
import { Button } from "../../ui/Button";
import { NativeSelect } from "../../ui/NativeSelect";
import { VolumeSlider } from "../../ui/VolumeSlider";
import {
  MuteKeybind,
  PTTKeybind,
  ChatKeybind,
  InviteKeybind,
  RequestToSpeakKeybind,
  OverlayKeybind,
} from "../keyboard-shortcuts";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";
import { useMicIdStore } from "../webrtc/stores/useMicIdStore";

interface OverlaySettingsProps { }
const overlaySettingsStruct = object({
  appTitle: string(),
});
const validateData = validateStruct(overlaySettingsStruct);
export const OverlaySettingsPage: PageComponent<OverlaySettingsProps> = () => {


  const { appTitle } = useOverlayStore.getState();

  const { t } = useTypeSafeTranslation();


  return (
    <DefaultDesktopLayout>
      <MiddlePanel>
        <div className="flex-col text-primary-100">
          <OverlayKeybind className={`mb-4`} />
          <Formik
            initialValues={{
              appTitle: appTitle,
            }}
            validateOnChange={false}
            validate={(values) => {
              return validateData({
                ...values,
                appTitle: values.appTitle.trim(),
              });
            }}
            onSubmit={async (data) => {
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
