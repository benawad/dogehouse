import React, { createContext } from "react";
import { soundEffects, useSoundEffectStore } from "./useSoundEffectStore";

const soundKeys = Object.keys(soundEffects);

export const SoundEffectContext = createContext<{
  playSoundEffect: (name: keyof typeof soundEffects) => void;
}>({ playSoundEffect: () => {} });

export const SoundEffectProvider: React.FC = ({}) => {
  const add = useSoundEffectStore((x) => x.add);

  return (
    <>
      {soundKeys.map((key) => (
        <audio
          preload="none"
          key={key}
          ref={(ref) => {
            if (ref) {
              ref.volume = 0.5;
              add(key, ref);
            }
          }}
          src={`/sound-effects/${
            soundEffects[key as keyof typeof soundEffects]
          }`}
        />
      ))}
    </>
  );
};
