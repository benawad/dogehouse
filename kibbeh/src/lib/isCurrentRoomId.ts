import { useCurrentRoomIdStore } from "../global-stores/useCurrentRoomIdStore";

export const isCurrentRoomId = (id: string) =>
  id && id === useCurrentRoomIdStore.getState().currentRoomId;
