import React from "react";
import { Volume2 } from "react-feather";
import {
  PossibleSoundEffect,
  useSoundEffectStore,
} from "../modules/sound-effects/useSoundEffectStore";
import { Checkbox } from "./Checkbox";

interface ChatSettingsProps {}

const capitalize = (s: string) =>
  s.length ? s[0].toUpperCase() + s.slice(1) : s;
const camelToReg = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => ` ${letter}`);

export const SoundEffectSettings: React.FC<ChatSettingsProps> = () => {
  const [
    soundEffectSettings,
    setSetting,
    playSoundEffect,
  ] = useSoundEffectStore((x) => [x.settings, x.setSetting, x.playSoundEffect]);

  return (
    <>
      <h1 className={`py-8 text-4xl`}>Sounds</h1>

      {Object.keys(soundEffectSettings).map((k) => {
        return (
          <div className={`flex`} key={k}>
            <Checkbox
              value={soundEffectSettings[k as PossibleSoundEffect]}
              label={capitalize(camelToReg(k))}
              onChange={() =>
                setSetting(
                  k as PossibleSoundEffect,
                  !soundEffectSettings[k as PossibleSoundEffect]
                )
              }
            />
            <button
              onClick={() => playSoundEffect(k as PossibleSoundEffect, true)}
              className={`ml-2`}
            >
              <Volume2 />
            </button>
          </div>
        );
      })}
    </>
  );
};
