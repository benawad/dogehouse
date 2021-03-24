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

interface BlockToken {
  t: "block";
  v: string;
}

interface EmoteToken {
  t: "emote";
  v: string;
}

export type RoomChatMessageToken =
  | TextToken
  | MentionToken
  | LinkToken
  | BlockToken
  | EmoteToken;

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
  username: string;
  displayName: string;
  tokens: RoomChatMessageToken[];
  deleted?: boolean;
  deleterId?: string;
  sentAt: string;
  isWhisper?: boolean;
}

export const useRoomChatStore = create(
  combine(
    {
      open: true,
      bannedUserIdMap: {} as Record<string, boolean>,
      messages: [] as RoomChatMessage[],
      newUnreadMessages: false,
      message: "" as string,
      isRoomChatScrolledToTop: false,
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
      setMessages: (messages: RoomChatMessage[]) =>
        set((s) => ({
          messages,
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
          useRoomChatMentionStore.getState().resetIAmMentioned();
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
      setOpen: (open: boolean) => set((s) => ({ ...s, open })),
      setIsRoomChatScrolledToTop: (isRoomChatScrolledToTop: boolean) =>
        set({
          isRoomChatScrolledToTop,
        }),
    })
  )
);
