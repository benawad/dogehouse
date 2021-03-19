import { CurrentRoom } from "@dogehouse/kebab";
import create from "zustand";
import { combine } from "zustand/middleware";

export const useCurrentRoomStore = create(
  combine(
    {
      currentRoom: null as CurrentRoom | null,
    },
    (set) => ({
      set,
      setCurrentRoom: (fn: (cr: CurrentRoom | null) => CurrentRoom | null) =>
        set((s) => ({ currentRoom: fn(s.currentRoom) })),
    })
  )
);
