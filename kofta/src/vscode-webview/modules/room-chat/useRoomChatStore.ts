import create from "zustand";
import { combine } from "zustand/middleware";

interface TextToken {
  t: "text";
  v: string;
}

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

const MAX_MESSAGE = 99;

export interface RoomChatMessage {
  id: string;
  userId: string;
  avatarUrl: string;
  color: string;
  displayName: string;
  tokens: TextToken[];
}

export const useRoomChatStore = create(
  combine(
    {
      open: false,
      bannedUserIdMap: {} as Record<string, boolean>,
      messages: [] as RoomChatMessage[],
      newUnreadMessages: 0,
    },
    (set) => ({
      addBannedUser: (userId: string) =>
        set((s) => ({
          messages: s.messages.filter((m) => m.userId !== userId),
          bannedUserIdMap: { ...s.bannedUserIdMap, [userId]: true },
        })),
      addMessage: (m: RoomChatMessage) =>
        set((s) => {
          const newMessages = s.newUnreadMessages >= MAX_MESSAGE 
            ? s.newUnreadMessages
            : s.newUnreadMessages + 1

          return {
            newUnreadMessages: s.open ? 0 : newMessages,
            messages: [
              { ...m, color: generateColorFromString(m.userId) },
              ...s.messages,
            ].slice(0, MAX_MESSAGE)
          };
        }),
      clearChat: () =>
        set({
          messages: [],
          newUnreadMessages: 0,
          bannedUserIdMap: {},
        }),
      reset: () =>
        set({
          messages: [],
          newUnreadMessages: 0,
          open: false,
          bannedUserIdMap: {},
        }),
      toggleOpen: () =>
        set((s) => {
          if (s.open) {
            return {
              open: false,
              newUnreadMessages: 0,
            };
          } else {
            return {
              open: true,
              newUnreadMessages: 0,
            };
          }
        }),
    })
  )
);
