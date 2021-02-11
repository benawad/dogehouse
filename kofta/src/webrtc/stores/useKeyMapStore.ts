import create from "zustand";
import { combine } from "zustand/middleware";

const MUTE_KEY = "@keybind/mute";

function getMuteKeybind() {
  let v = "";
  try {
    v = localStorage.getItem(MUTE_KEY) || "";
  } catch {}

  return v || "Control+m";
}

export const useKeyMapStore = create(
  combine(
    {
      keyMap: {
        MUTE: getMuteKeybind(),
      },
    },
    (set) => ({
      setMuteKeybind: (id: string) => {
        try {
          localStorage.setItem(MUTE_KEY, id);
        } catch {}
        set((x) => ({ keyMap: { ...x.keyMap, MUTE: id } }));
      },
    })
  )
);
