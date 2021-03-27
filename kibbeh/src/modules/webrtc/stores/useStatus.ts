import create from "zustand";
import { combine } from "zustand/middleware";

type State =
  | "init"
  | "ws-disconnected"
  | "voice-server-disconnected"
  | "connected-no-room"
  | "connected-listener"
  | "bad-auth"
  | "killed"
  | "connected-speaker";

export const useStatus = create(
  combine(
    {
      status: "init" as State,
    },
    (set) => ({
      setStatus: (status: State) => set({ status }),
    })
  )
);
