import React, { useCallback, useEffect, useState } from "react";
import { useGlobalVolumeStore } from "../../global-stores/useGlobalVolumeStore";
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
} from "../keyboard-shortcuts";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";
import { useMicIdStore } from "../webrtc/stores/useMicIdStore";

interface VoiceSettingsProps {}

export const VoiceSettingsPage: PageComponent<VoiceSettingsProps> = () => {
  const { micId, setMicId } = useMicIdStore();
  const { volume, set } = useGlobalVolumeStore();
  const [devices, setDevices] = useState<Array<{ id: string; label: string }>>(
    []
  );

  const fetchMics = useCallback(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
      navigator.mediaDevices
        ?.enumerateDevices()
        .then((d) =>
          setDevices(
            d
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
    <DefaultDesktopLayout>
      <MiddlePanel>
        <div className="flex-col text-primary-100">
          <div className={`mb-2`}>{t("pages.voiceSettings.mic")} </div>
          {devices.length ? (
            <NativeSelect
              className={`mb-4`}
              value={micId}
              onChange={(e) => setMicId(e.target.value)}
            >
              {devices.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          ) : (
            <div className={`mb-4`}>
              {t("pages.voiceSettings.permissionError")}
            </div>
          )}
          <div>
            <Button
              size="small"
              onClick={() => {
                fetchMics();
              }}
            >
              {t("pages.voiceSettings.refresh")}
            </Button>
          </div>
          <div className={`mt-8 mb-2`}>{t("pages.voiceSettings.volume")} </div>
          <div className={`mb-8`}>
            <VolumeSlider
              volume={volume}
              onVolume={(n) => set({ volume: n })}
            />
          </div>
          <MuteKeybind className={`mb-4`} />
          <PTTKeybind className={`mb-4`} />
          <ChatKeybind className={`mb-4`} />
          <InviteKeybind className={`mb-4`} />
          <RequestToSpeakKeybind />
        </div>
      </MiddlePanel>
    </DefaultDesktopLayout>
  );
};

VoiceSettingsPage.ws = true;
