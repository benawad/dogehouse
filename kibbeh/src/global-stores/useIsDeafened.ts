import create from "zustand";
import { combine } from "zustand/middleware";

export const useIsDeafened = create(
  combine(
    {
      isDeafened: false,
    },
    (set) => ({
      setIsDeafened: (isDeafened: boolean) => {
        set({ isDeafened });
      },
    })
  )
);
