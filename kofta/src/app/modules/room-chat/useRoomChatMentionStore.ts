import create from "zustand";
import { combine } from "zustand/middleware";
import { BaseUser } from "../../types";
import { useSoundEffectStore } from "../sound-effects/useSoundEffectStore";

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
      resetIAmMentioned: () =>
        set({
          iAmMentioned: 0,
        }),
      incrementIAmMentioned: () => {
        useSoundEffectStore.getState().playSoundEffect("roomChatMention");
        set((x) => ({ iAmMentioned: x.iAmMentioned + 1 }));
      },
    })
  )
);
