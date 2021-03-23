import create from "zustand";
import { combine } from "zustand/middleware";

export const MIC_KEY = "micId";

export const useMicIdStore = create(
  combine(
    {
      micId: localStorage.getItem(MIC_KEY) || "",
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
