import create from "zustand";
import { combine } from "zustand/middleware";
import { BaseUser } from "../../types";

export const useRoomChatMentionStore = create(
  combine(
    {
      mentions: [] as BaseUser[],
      queriedUsernames: [] as BaseUser[],
      activeUsername: "",
      iAmMentioned: 0,
    },
    (set) => ({
      setMentions: (mentions: BaseUser[]) =>
        set({
          mentions,
        }),
      setQueriedUsernames: (queriedUsernames: BaseUser[]) =>
        set({
          queriedUsernames,
        }),
      setActiveUsername: (activeUsername: string) => {
        return set({
          activeUsername,
        });
      },
      setIAmMentioned: (iAmMentioned: number) =>
        set({
          iAmMentioned,
        }),
      incrementIAmMentioned: () =>
        set((x) => ({ iAmMentioned: x.iAmMentioned + 1 })),
    })
  )
);
