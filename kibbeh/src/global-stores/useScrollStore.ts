import create from "zustand";
import { combine } from "zustand/middleware";
// this is to fix #2212, but it isn't working as of right now, see pages/_app.tsx.
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
