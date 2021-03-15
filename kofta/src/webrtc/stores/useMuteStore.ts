import create from "zustand";
import { combine } from "zustand/middleware";
import { useSoundEffectStore } from "../../app/modules/sound-effects/useSoundEffectStore";

export const useMuteStore = create(
  combine(
    {
      muted: false,
    },
    (set) => ({
      setMute: (muted: boolean) => {
        if (muted) {
          useSoundEffectStore.getState().playSoundEffect("mute");
        } else {
          useSoundEffectStore.getState().playSoundEffect("unmute");
        }
        set({ muted });
      },
    })
  )
);
