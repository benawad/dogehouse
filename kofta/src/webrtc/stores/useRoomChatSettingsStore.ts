import create from "zustand";
import { combine } from "zustand/middleware";

const SHOULD_PLAY_CHAT_SOUND_KEY = "@chatSettings/should_play_chat_sound";

function getShouldPlayChatSound() {
  let v = "";
  try {
    v = localStorage.getItem(SHOULD_PLAY_CHAT_SOUND_KEY) || "";
  } catch {}

  return !v || v === "true";
}

export const useRoomChatSettingsStore = create(
  combine(
    {
      shouldPlayChatSound: getShouldPlayChatSound(),
    },
    (set) => ({
      setShouldPlayChatSound: (bool: boolean) => {
        try {
          localStorage.setItem(SHOULD_PLAY_CHAT_SOUND_KEY, bool.toString());
        } catch {}
        set((x) => ({
          ...x,
          shouldPlayChatSound: bool,
        }));
      },
    })
  )
);
