import create from "zustand";
import { combine } from "zustand/middleware";

export const useMicPermErrorStore = create(
  combine(
    {
      error: false,
    },
    (set) => ({
      set,
    })
  )
);
