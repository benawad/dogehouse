import create from "zustand";
import { combine } from "zustand/middleware";

export const useAccountOverlay = create(
  combine(
    {
      isOpen: false,
    },
    (set) => ({
      set,
    })
  )
);
