import React, { useEffect } from "react";
import {
    OverlayKeybind,
} from "./keyboard-shortcuts";
import { Formik } from "formik";
import { object, string } from "superstruct";
import { validateStruct } from "../utils/validateStruct";
import { InputField } from "./form-fields/InputField";
import { Button } from "./Button";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";
import isElectron from "is-electron";
import { useHistory } from "react-router-dom";
import { useOverlayStore } from "../utils/useOverlayStore";

interface OverlaySettingsProps { }

const overlaySettingsStruct = object({
    appTitle: string(),
});

const isMac = process.platform === 'darwin';

const validateData = validateStruct(overlaySettingsStruct);

export const OverlaySettings: React.FC<OverlaySettingsProps> = () => {
    const { t } = useTypeSafeTranslation();
    const history = useHistory();
    const { appTitle } = useOverlayStore.getState();
    useEffect(() => {
        if (!isElectron() || isMac) {
            history.push('/me')
        }
    }, [history]);

    return (
        <>
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
        </>
    );
};
