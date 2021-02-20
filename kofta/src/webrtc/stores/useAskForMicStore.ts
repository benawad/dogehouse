import create from "zustand";
import { combine } from "zustand/middleware";

export const useAskForMicStore = create(
  combine(
    {
      hasAsked: false,
    },
    (set) => ({
      set,
    })
  )
);
