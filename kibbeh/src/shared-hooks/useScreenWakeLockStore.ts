import create from "zustand";
import { combine } from "zustand/middleware";
import "wakelock-lazy-polyfill";

export const useWakeLockStore = create(
  combine(
    {
      wakeLock: null as WakeLockSentinel | null,
    },
    (set, get) => ({
      requestWakeLock: async () => {
        try {
          const wakeLock: WakeLockSentinel | null = await navigator.wakeLock.request(
            "screen"
          );
          set({ wakeLock });
        } catch (error) {
          console.log("wake lock request failed", { error });
        }
      },
      releaseWakeLock: async () => {
        const { wakeLock } = get();
        if (!wakeLock) return;
        try {
          await wakeLock.release();
          set({ wakeLock: null });
        } catch (error) {
          console.log("Wake lock releasing failed", { error });
        }
      },
    })
  )
);
