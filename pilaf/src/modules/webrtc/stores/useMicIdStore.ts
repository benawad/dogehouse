import create from "zustand";
import { combine } from "zustand/middleware";

export const MIC_KEY = "micId";

const getInitialState = () => {
  try {
    return localStorage.getItem(MIC_KEY) || "";
  } catch {
    return "";
  }
};

export const useMicIdStore = create(
  combine(
    {
      micId: getInitialState(),
    },
    (set) => ({
      setMicId: (id: string) => {
        try {
          localStorage.setItem(MIC_KEY, id);
        } catch {}
        set({ micId: id });
      },
    })
  )
);
