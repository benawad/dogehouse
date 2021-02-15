import { KeyMap } from "react-hotkeys";
import create from "zustand";
import { combine } from "zustand/middleware";

const MUTE_KEY = "@keybind/mute";
const PTT_KEY = "@keybind/ptt";

function getMuteKeybind() {
  let v = "";
  try {
    v = localStorage.getItem(MUTE_KEY) || "";
  } catch {}

  return v || "Control+m";
}

function getPTTKeybind() {
  let v = "";
  try {
    v = localStorage.getItem(PTT_KEY) || "";
  } catch {}

  return v || "0";
}

const keyMap: KeyMap = {
  MUTE: getMuteKeybind(),
  PTT: [
    { sequence: getPTTKeybind(), action: "keydown" },
    { sequence: getPTTKeybind(), action: "keyup" },
  ],
};

const keyNames: KeyMap = {
  MUTE: getMuteKeybind(),
  PTT: getPTTKeybind(),
};

export const useKeyMapStore = create(
  combine(
    {
      keyMap,
      keyNames,
    },
    set => ({
      setMuteKeybind: (id: string) => {
        try {
          localStorage.setItem(MUTE_KEY, id);
        } catch {}
        set(x => ({
          keyMap: { ...x.keyMap, MUTE: id },
          keyNames: { ...x.keyNames, MUTE: id },
        }));
      },
      setPTTKeybind: (id: string) => {
        try {
          localStorage.setItem(PTT_KEY, id);
        } catch {}
        set(x => ({
          keyMap: {
            ...x.keyMap,
            PTT: [
              { sequence: id, action: "keydown" },
              { sequence: id, action: "keyup" },
            ],
          },
          keyNames: { ...x.keyNames, PTT: id },
        }));
      },
    }),
  ),
);
