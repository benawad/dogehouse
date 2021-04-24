import { CustomEmote } from "./../modules/room/chat/EmoteData";
import create from "zustand";
import { combine } from "zustand/middleware";

export const useEmojiPickerStore = create(
  combine(
    {
      open: false,
      query: "",
      queryMatches: [] as CustomEmote[],
      keyboardHoveredEmoji: null as null | string,
    },
    (set) => ({
      setOpen: (open: boolean) => set({ open }),
      setQuery: (query: string) => set({ query }),
      setQueryMatches: (queryMatches: CustomEmote[]) => set({ queryMatches }),
      setKeyboardHoveredEmoji: (keyboardHoveredEmoji: string | null) =>
        set({ keyboardHoveredEmoji }),
    })
  )
);
