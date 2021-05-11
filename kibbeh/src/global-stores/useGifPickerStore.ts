import { CustomEmote } from "./../modules/room/chat/EmoteData";
import create from "zustand";
import { combine } from "zustand/middleware";

export const useGifPickerStore = create(
    combine(
        {
            toggle: false,
            query: "",
        },
        (set) => ({
            setToggle: (toggle: boolean) => set({ toggle }),
            setQuery: (query: string) => set({ query })
        })
    )
);
