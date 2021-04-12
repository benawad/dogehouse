import create from "zustand";
import { combine } from "zustand/middleware";

type Fn = (currentRoomId: string | null) => string | null;

export const useCurrentRoomIdStore = create(
  combine(
    {
      currentRoomId: null as string | null,
    },
    (set) => ({
      set,
      setCurrentRoomId: (currentRoomIdOrFn: string | null | Fn) => {
        if (typeof currentRoomIdOrFn === "function") {
          set((s) => ({ currentRoomId: currentRoomIdOrFn(s.currentRoomId) }));
        } else {
          set({ currentRoomId: currentRoomIdOrFn });
        }
      },
    })
  )
);
