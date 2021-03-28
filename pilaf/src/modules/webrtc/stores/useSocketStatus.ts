import create from "zustand";
import { combine } from "zustand/middleware";

type State =
  | "auth-good"
  | "open"
  | "connecting"
  | "closed-by-server"
  | "closed";

export const useSocketStatus = create(
  combine(
    {
      status: "connecting" as State,
    },
    (set) => ({
      setStatus: (status: State) => set({ status }),
    })
  )
);
