import Sound from "react-native-sound";
import create from "zustand";
import { combine } from "zustand/middleware";

Sound.setCategory("Playback");

const buildSound = (name: string): Sound => {
  return new Sound(name, Sound.MAIN_BUNDLE, (error) => {
    console.log(error);
  });
};

export const soundEffects = {
  room_chat_mention: buildSound("room_chat_mention.wav"),
  unmute: buildSound("unmute.wav"),
  mute: buildSound("mute.wav"),
  room_invite: buildSound("room_invite.wav"),
};

export type PossibleSoundEffect = keyof typeof soundEffects;

function getInitialSettings() {
  const soundEffectSettings: Record<PossibleSoundEffect, boolean> = {
    room_chat_mention: true,
    unmute: true,
    mute: true,
    room_invite: true,
  };

  return soundEffectSettings;
}

export const useSoundEffectStore = create(
  combine(
    {
      soundEffect: soundEffects,
      settings: getInitialSettings(),
    },
    (_, get) => ({
      playSoundEffect: (se: keyof typeof soundEffects, force = false) => {
        const { soundEffect, settings } = get();
        if (force || settings[se]) {
          soundEffect[se]?.play();
        }
      },
    })
  )
);
