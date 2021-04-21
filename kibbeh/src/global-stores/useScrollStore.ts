import create from "zustand";
import { combine } from "zustand/middleware";

export const useScrollStore = create(
    combine(
        {
            scrollTime: 0,
        },
        (set) => ({
            setData: (scrollTime: number) => {
                console.log(scrollTime);
                set({ scrollTime });
            },
        })
    )
);
