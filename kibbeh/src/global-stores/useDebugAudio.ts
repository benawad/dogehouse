import create from "zustand";
import { combine } from "zustand/middleware";

const key = "@debug-audio";

const getDefaultValue = () => {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
};

export const useDebugAudioStore = create(
  combine(
    {
      debugAudio: getDefaultValue(),
    },
    (set) => ({
      setDebugAudio: (v: boolean) => {
        try {
          localStorage.setItem(
            "debug",
            v ? "mediasoup-client:WARN* mediasoup-client:ERROR*" : ""
          );
          localStorage.setItem(key, "" + v);
        } catch {}
        set({ debugAudio: v });
      },
    })
  )
);
