import create from "zustand";
import { combine } from "zustand/middleware";

export const useAFKStore = create(
  combine(
    {
      isAFK: false,
    },
    (set) => ({
      setIsAFK: (bool: boolean) => {
        set((x) => ({
          ...x,
          isAFK: bool,
        }));
      },
    })
  )
);
