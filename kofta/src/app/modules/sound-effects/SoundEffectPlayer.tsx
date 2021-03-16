import React, { createContext } from "react";
import { soundEffects, useSoundEffectStore } from "./useSoundEffectStore";

const soundKeys = Object.keys(soundEffects);

export const SoundEffectContext = createContext<{
  playSoundEffect: (name: keyof typeof soundEffects) => void;
}>({ playSoundEffect: () => {} });

export const SoundEffectPlayer: React.FC = ({}) => {
  const add = useSoundEffectStore((x) => x.add);

  return (
    <>
      {soundKeys.map((key) => (
        <audio
          preload="none"
          controls={false}
          key={key}
          ref={(ref) => {
            if (ref) {
              ref.volume = 0.7;
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
