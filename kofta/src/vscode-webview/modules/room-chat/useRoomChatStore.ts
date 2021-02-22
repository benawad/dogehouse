import create from "zustand";
import { combine } from "zustand/middleware";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";

interface TextToken {
  t: "text";
  v: string;
}
interface MentionToken {
  t: "mention";
  v: string;
}
interface LinkToken {
  t: "link";
  v: string;
}

export type RoomChatMessageToken = TextToken | MentionToken | LinkToken;

const colors = [
  "#ff2366",
  "#fd51d9",
  "#face15",
  "#8d4de8",
  "#6859ea",
  "#7ed321",
  "#56b2ba",
  "#00CCFF",
  "#FF9900",
  "#FFFF66",
];

function generateColorFromString(str: string) {
  let sum = 0;
  for (let x = 0; x < str.length; x++) sum += x * str.charCodeAt(x);
  return colors[sum % colors.length];
}

export interface RoomChatMessage {
  id: string;
  userId: string;
  avatarUrl: string;
  color: string;
  displayName: string;
  tokens: RoomChatMessageToken[];
}

export const useRoomChatStore = create(
  combine(
    {
      open: false,
      bannedUserIdMap: {} as Record<string, boolean>,
      messages: [] as RoomChatMessage[],
      newUnreadMessages: false,
      message: "" as string,
    },
    (set) => ({
      addBannedUser: (userId: string) =>
        set((s) => ({
          messages: s.messages.filter((m) => m.userId !== userId),
          bannedUserIdMap: { ...s.bannedUserIdMap, [userId]: true },
        })),
      addMessage: (m: RoomChatMessage) =>
        set((s) => ({
          newUnreadMessages: !s.open,
          messages: [
            { ...m, color: generateColorFromString(m.userId) },
            ...(s.messages.length > 100
              ? s.messages.slice(0, 100)
              : s.messages),
          ],
        })),
      clearChat: () =>
        set({
          messages: [],
          newUnreadMessages: false,
          bannedUserIdMap: {},
        }),
      reset: () =>
        set({
          messages: [],
          newUnreadMessages: false,
          open: false,
          bannedUserIdMap: {},
        }),
      toggleOpen: () =>
        set((s) => {
          // Reset mention state
          useRoomChatMentionStore.getState().setIAmMentioned(0);
          if (s.open) {
            return {
              open: false,
              newUnreadMessages: false,
            };
          } else {
            return {
              open: true,
              newUnreadMessages: false,
            };
          }
        }),
      setMessage: (message: string) =>
        set({
          message,
        }),
    })
  )
);
