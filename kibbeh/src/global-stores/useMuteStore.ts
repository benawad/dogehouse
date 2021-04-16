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
      setInternalMute: (muted: boolean) => {
        if (muted) {
          useSoundEffectStore.getState().playSoundEffect("mute");
          useWakeLockStore.getState().releaseWakeLock();
        } else {
          useSoundEffectStore.getState().playSoundEffect("unmute");
          useWakeLockStore.getState().requestWakeLock();
        }
        set({ muted });
      },
    })
  )
);
