import create from "zustand";
import { combine } from "zustand/middleware";

export const useOnRoomPage = create(
  combine(
    {
      onRoomPage: false,
    },
    (set) => ({
      setOnRoomPage: (onRoomPage: boolean) => {
        set({ onRoomPage });
      },
    })
  )
);
