import React, { useEffect } from "react";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";
import { InfoText } from "../../ui/InfoText";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";
import {
  useSoundEffectStore,
  PossibleSoundEffect,
} from "../sound-effects/useSoundEffectStore";
import { HeaderController } from "../../modules/display/HeaderController";
import isElectron from "is-electron";
import { PageComponent } from "../../types/PageComponent";

interface ChatSettingsProps {}

const capitalize = (s: string) =>
  s.length ? s[0].toUpperCase() + s.slice(1) : s;
const camelToReg = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => ` ${letter}`);

export const SoundEffectSettings: PageComponent<ChatSettingsProps> = () => {
  const [
    soundEffectSettings,
    setSetting,
    playSoundEffect,
  ] = useSoundEffectStore((x) => [x.settings, x.setSetting, x.playSoundEffect]);
  const { t } = useTypeSafeTranslation();
  useEffect(() => {
    if (isElectron()) {
      const ipcRenderer = window.require("electron").ipcRenderer;
      ipcRenderer.send("@rpc/page", {
        page: "sound-effect-settings",
        opened: true,
        modal: false,
        data: "",
      });
      return () => {
        ipcRenderer.send("@rpc/page", {
          page: "sound-effect-settings",
          opened: false,
          modal: false,
          data: "",
        });
      };
    }
  }, []);
  return (
    <DefaultDesktopLayout>
      <HeaderController
        embed={{}}
        title={t("pages.soundEffectSettings.title")}
      />
      <MiddlePanel>
        <h1 className={`pb-4 text-4xl text-primary-100`}>
          {t("pages.soundEffectSettings.header")}
        </h1>

        {Object.keys(soundEffectSettings).map((k) => {
          return (
            <div className={`flex mb-4 items-center`} key={k}>
              <InfoText>{capitalize(camelToReg(k))}</InfoText>
              <input
                className="ml-2"
                type="checkbox"
                checked={soundEffectSettings[k as PossibleSoundEffect]}
                onChange={() =>
                  setSetting(
                    k as PossibleSoundEffect,
                    !soundEffectSettings[k as PossibleSoundEffect]
                  )
                }
              />
              <Button
                size="small"
                onClick={() => playSoundEffect(k as PossibleSoundEffect, true)}
                className={`ml-4`}
              >
                {t("pages.soundEffectSettings.playSound")}
              </Button>
            </div>
          );
        })}
      </MiddlePanel>
    </DefaultDesktopLayout>
  );
};

SoundEffectSettings.ws = true;
