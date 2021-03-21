import { useAtom } from "jotai";
import React, { useCallback, useEffect, useState } from "react";
import { volumeAtom } from "../shared-atoms";
import { useMicIdStore } from "../shared-stores";
import { Button } from "./Button";

import { VolumeSlider } from "./VolumeSlider";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

interface VoiceSettingsProps {}

export const VoiceSettings: React.FC<VoiceSettingsProps> = () => {
    const { micId, setMicId } = useMicIdStore();
    const [volume, setVolume] = useAtom(volumeAtom);
    const [devices, setDevices] = useState<Array<{ id: string; label: string }>>(
        []
    );

    const fetchMics = useCallback(() => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
            navigator.mediaDevices
                ?.enumerateDevices()
                .then((devices) =>
                    setDevices(
                        devices
                            .filter(
                                (device) => device.kind === "audioinput" && device.deviceId
                            )
                            .map((device) => ({ id: device.deviceId, label: device.label }))
                    )
                );
        });
    }, []);

    const { t } = useTypeSafeTranslation();

    useEffect(() => {
        fetchMics();
    }, [fetchMics]);

    return (
        <>
            <h1 className={"pb-2 text-lg"}>
                {t("pages.voiceSettings.header")}
            </h1>
            <div className={"flex items-center pb-2"}>
                <div>{t("pages.voiceSettings.mic")}</div>
                {devices.length ? (
                    <select
                        className={"font-mono text-xs md:text-sm"}
                        value={micId}
                        onChange={(e) => setMicId(e.target.value)}
                    >
                        {devices.map(({ id, label }) => (
                            <option key={id} value={id}>
                                {label}
                            </option>
                        ))}
                    </select>
        
                ) : (
                    <div className={"mb-4"}>{t("pages.voiceSettings.permissionError")}</div>
                )}</div>
            <div>
                <Button
                    variant="small"
                    onClick={() => {
                        fetchMics();
                    }}
                >
                    {t("pages.voiceSettings.refresh")}
                </Button>
            </div>
            <div className={"flex items-center my-4"}>
                <div className={"mb-2 capitalize"}>{t("pages.voiceSettings.volume")}</div>
                <div className={"flex-grow ml-2"}>
                    <VolumeSlider volume={volume} onVolume={(n) => setVolume(n)} /></div>
            </div>
        </>
    );
};
