import create from "zustand";
import { combine } from "zustand/middleware";
import { useRoomChatStore } from "../modules/room/chat/useRoomChatStore";

type Fn = (currentRoomId: string | null) => string | null;

export const useCurrentRoomIdStore = create(
  combine(
    {
      currentRoomId: null as string | null,
    },
    (set, get) => ({
      set,
      setCurrentRoomId: (currentRoomIdOrFn: string | null | Fn) => {
        const id = get().currentRoomId;
        const newId =
          typeof currentRoomIdOrFn === "function"
            ? currentRoomIdOrFn(id)
            : currentRoomIdOrFn;
        if (newId !== id) {
          useRoomChatStore.getState().reset();
        }
        set({ currentRoomId: newId });
      },
    })
  )
);
