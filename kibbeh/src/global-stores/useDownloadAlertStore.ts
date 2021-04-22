import create from "zustand";
import { combine } from "zustand/middleware";

const downloadalertkey = "@baklava/showDownloadAlert";

const getDefaultValues = () => {
  try {
    const v = JSON.parse(localStorage.getItem(downloadalertkey) || "true");
    return {
      shouldAlert: v,
    };
  } catch {
    return {
      shouldAlert: true,
    };
  }
};

export const useDownloadAlertStore = create(
  combine(getDefaultValues(), (set) => ({
    setData: (x: { shouldAlert: boolean }) => {
      try {
        localStorage.setItem(downloadalertkey, JSON.stringify(x.shouldAlert));
      } catch {}

      set(x);
    },
  }))
);
