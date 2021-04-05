import create from "zustand";
import { combine } from "zustand/middleware";

export const useGlobalVolumeStore = create(
  combine(
    {
      volume: 100,
    },
    (set) => ({
      set,
    })
  )
);
