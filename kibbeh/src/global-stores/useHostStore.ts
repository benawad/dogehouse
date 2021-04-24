import create from "zustand";
import { combine } from "zustand/middleware";

const hostPlatformkey = "@app/hostPlatform";

const getDefaultValues = () => {
  try {
    const v = JSON.parse(
      localStorage.getItem(hostPlatformkey) ||
        '{"isLinux":false,"isWin":false,"isMac":false}'
    );
    return { isLinux: v.isLinux, isWin: v.isWin, isMac: v.isMac };
  } catch {
    return { isLinux: false, isWin: false, isMac: false };
  }
};

export const useHostStore = create(
  combine(getDefaultValues(), (set) => ({
    setData: (x: { isLinux: boolean; isWin: boolean; isMac: boolean }) => {
      try {
        localStorage.setItem(hostPlatformkey, JSON.stringify(x));
      } catch {}

      set(x);
    },
  }))
);
