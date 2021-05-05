import { useCurrentRoomId } from "./useCurrentRoomId";
import { useTypeSafeQuery } from "./useTypeSafeQuery";

export const useCurrentRoomFromCache = () => {
  const roomId = useCurrentRoomId();
  // this should read from the cache
  const { data } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", roomId!],
    { enabled: false },
    [roomId!]
  );

  return data;
};
