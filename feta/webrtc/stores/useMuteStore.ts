import create from "zustand";
import { combine } from "zustand/middleware";

export const useMuteStore = create(
  combine(
    {
      muted: false,
    },
    (set) => ({
      toggleMute: () => set((s) => ({ muted: !s.muted })),
      set,
    })
  )
);
