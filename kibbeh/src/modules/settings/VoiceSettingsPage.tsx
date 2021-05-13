import React, { useEffect } from "react";
import { useGlobalVolumeStore } from "../../global-stores/useGlobalVolumeStore";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { PageComponent } from "../../types/PageComponent";
import { Button } from "../../ui/Button";
import { NativeSelect } from "../../ui/NativeSelect";
import { VolumeSlider } from "../../ui/VolumeSlider";
import {
  MuteKeybind,
  DeafKeybind,
  PTTKeybind,
  ChatKeybind,
  InviteKeybind,
  RequestToSpeakKeybind,
} from "../keyboard-shortcuts";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";
import { useMicIdStore } from "../webrtc/stores/useMicIdStore";
import { HeaderController } from "../../modules/display/HeaderController";
import isElectron from "is-electron";
import { useDevices } from "../../shared-hooks/useDevices";

interface VoiceSettingsProps {}

export const VoiceSettingsPage: PageComponent<VoiceSettingsProps> = () => {
  const { micId, setMicId } = useMicIdStore();
  const { volume, set } = useGlobalVolumeStore();
  const { devices, fetchMics } = useDevices();

  useEffect(() => {
    if (isElectron()) {
      const ipcRenderer = window.require("electron").ipcRenderer;
      ipcRenderer.send("@rpc/page", {
        page: "voice-settings",
        opened: true,
        modal: false,
        data: "",
      });
      return () => {
        ipcRenderer.send("@rpc/page", {
          page: "voice-settings",
          opened: false,
          modal: false,
          data: "",
        });
      };
    }
  }, []);

  const { t } = useTypeSafeTranslation();

  return (
    <DefaultDesktopLayout>
      <HeaderController embed={{}} title={t("pages.voiceSettings.title")} />
      <MiddlePanel>
        <div className="flex flex-col text-primary-100">
          <div className={`flex mb-2`}>{t("pages.voiceSettings.mic")} </div>
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
            <div className={`flex mb-4`}>
              {t("pages.voiceSettings.permissionError")}
            </div>
          )}
          <div className="flex">
            <Button
              size="small"
              onClick={() => {
                fetchMics();
              }}
            >
              {t("pages.voiceSettings.refresh")}
            </Button>
          </div>
          <div className={`flex mt-8 mb-2`}>
            {t("pages.voiceSettings.volume")}{" "}
          </div>
          <div className={`flex mb-8`}>
            <VolumeSlider
              volume={volume}
              onVolume={(n) => set({ volume: n })}
            />
          </div>
          <MuteKeybind className={`mb-4`} />
          <DeafKeybind className={`mb-4`} />
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
