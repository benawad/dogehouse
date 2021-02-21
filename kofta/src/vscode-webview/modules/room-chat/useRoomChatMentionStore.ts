import create from "zustand";
import { combine } from "zustand/middleware";
import { User } from "../../types";

export const useRoomChatMentionStore = create(
  combine(
    {
      mentions: [] as User[],
      queriedUsernames: [] as User[],
      activeUsername: "",
      iAmMentioned: 0,
    },
    (set) => ({
      setMentions: (mentions: User[]) =>
        set({
          mentions,
        }),
      setQueriedUsernames: (queriedUsernames: User[]) =>
        set({
          queriedUsernames,
        }),
      setActiveUsername: (activeUsername: string) =>
        set({
          activeUsername,
        }),
      setIAmMentioned: (iAmMentioned: number) =>
        set({
          iAmMentioned,
        }),
      incrementIAmMentioned: () =>
        set((x) => ({ iAmMentioned: x.iAmMentioned + 1 })),
    })
  )
);
