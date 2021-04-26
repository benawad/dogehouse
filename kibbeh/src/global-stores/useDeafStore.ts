import create from "zustand";
import { combine } from "zustand/middleware";
import { useSoundEffectStore } from "../modules/sound-effects/useSoundEffectStore";

export const useDeafStore = create(
  combine(
    {
      deafened: false,
    },
    (set) => ({
      // don't call this directly unless you know what you are doing
      // use useSetDeaf hook intead
      setInternalDeaf: (deafened: boolean, playSound = true) => {
        // to prevent sound overlapping
        if (playSound) {
          useSoundEffectStore
            .getState()
            .playSoundEffect(deafened ? "deafen" : "undeafen");
        }
        set({ deafened });
      },
    })
  )
);
