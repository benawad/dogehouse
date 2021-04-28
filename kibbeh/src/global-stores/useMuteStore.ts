import create from "zustand";
import { combine } from "zustand/middleware";
import { useSoundEffectStore } from "../modules/sound-effects/useSoundEffectStore";
import { useWakeLockStore } from "../shared-hooks/useScreenWakeLockStore";

export const useMuteStore = create(
  combine(
    {
      muted: false,
    },
    (set) => ({
      // don't call this directly unless you know what you are doing
      // use useSetMute hook intead
      setInternalMute: (muted: boolean, playSound = true) => {
        if (muted) {
          useWakeLockStore.getState().releaseWakeLock();
        } else {
          useWakeLockStore.getState().requestWakeLock();
        }
        // to prevent sound overlapping
        if (playSound) {
          useSoundEffectStore
            .getState()
            .playSoundEffect(muted ? "mute" : "unmute");
        }
        set({ muted });
      },
    })
  )
);
