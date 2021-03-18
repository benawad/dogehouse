import { Producer } from "mediasoup-client/lib/types";
import create from "zustand";
import { combine } from "zustand/middleware";

export const useShowRoomModal = create(
  combine(
    {
      state: "" as "" | "direct" | "scheduled",
    },
    (set) => ({
      set: (v: "" | "direct" | "scheduled") => {
        set((s) => {
          return { state: v };
        });
      },
    })
  )
);
