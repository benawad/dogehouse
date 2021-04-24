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
      // use useSetMute hook intead
      setInternalDeaf: (deafened: boolean) => {
        if (deafened) {
          // @todo: add deafen/undeafen sounds
          useSoundEffectStore.getState().playSoundEffect("deafen");
        } else {
          useSoundEffectStore.getState().playSoundEffect("undeafen");
        }
        set({ deafened });
      },
    })
  )
);
