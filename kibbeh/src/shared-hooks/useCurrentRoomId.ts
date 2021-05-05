import { useRouter } from "next/router";
import { useCurrentRoomIdStore } from "../global-stores/useCurrentRoomIdStore";

export const useCurrentRoomId = () => {
  const { pathname, query } = useRouter();
  const { currentRoomId } = useCurrentRoomIdStore();
  if (pathname === "/room/[id]" && query.id && typeof query.id === "string") {
    return query.id;
  }
  return currentRoomId;
};
