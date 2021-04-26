import { BaseUser } from "@dogehouse/kebab";
import create from "zustand";
import { combine } from "zustand/middleware";
import { useSoundEffectStore } from "../modules/sound-effects/useSoundEffectStore";

export const useRoomChatMentionStore = create(
  combine(
    {
      queriedUsernames: [] as BaseUser[],
      activeUsername: "",
      iAmMentioned: 0,
    },
    (set) => ({
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
