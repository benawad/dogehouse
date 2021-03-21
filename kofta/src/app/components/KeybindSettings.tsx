import {
    MuteKeybind,
    PTTKeybind,
    ChatKeybind,
    InviteKeybind,
    RequestToSpeakKeybind,
} from "./keyboard-shortcuts";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";
import React from "react";

interface KeybindSettingsProps { }

export const KeybindSettings: React.FC<KeybindSettingsProps> = ({ }) => {
    const { t } = useTypeSafeTranslation();
    return (
        <>
            <h1 className={"pb-2 text-lg"}>
                {t("pages.keybindSettings.header")}
            </h1>
            <MuteKeybind className={"mb-4"} />
            <PTTKeybind className={"mb-4"} />
            <ChatKeybind className={"mb-4"} />
            <InviteKeybind className={"mb-4"} />
            <RequestToSpeakKeybind />
        </>
    );
};



