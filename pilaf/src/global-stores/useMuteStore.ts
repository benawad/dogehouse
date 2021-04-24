import create from "zustand";
import { combine } from "zustand/middleware";
import { useSoundEffectStore } from "../modules/sound-effect/useSoundEffectStore";

export const useMuteStore = create(
  combine(
    {
      muted: false,
    },
    (set) => ({
      // don't call this directly unless you know what you are doing
      // use useSetMute hook intead
      setInternalMute: (muted: boolean) => {
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
