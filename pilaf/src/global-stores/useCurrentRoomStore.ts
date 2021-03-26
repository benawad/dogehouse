import { Room } from "@dogehouse/kebab";
import create from "zustand";
import { combine } from "zustand/middleware";

export const useCurrentRoomStore = create(
  combine(
    {
      currentRoom: null as Room | null,
    },
    (set) => ({
      set,
      setCurrentRoom: (fn: (cr: Room | null) => Room | null) =>
        set((s) => ({ currentRoom: fn(s.currentRoom) })),
    })
  )
);
