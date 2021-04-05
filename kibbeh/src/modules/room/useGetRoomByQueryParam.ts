import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { isServer } from "../../lib/isServer";
import { isUuid } from "../../lib/isUuid";
import { showErrorToast } from "../../lib/showErrorToast";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";

export const useGetRoomByQueryParam = () => {
  const { setCurrentRoomId } = useCurrentRoomIdStore();
  const { query } = useRouter();
  const roomId = typeof query.id === "string" ? query.id : "";
  const { data, isLoading } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", roomId || ""],
    {
      enabled: isUuid(roomId) && !isServer,
      refetchOnMount: "always",
      onSuccess: ((d: JoinRoomAndGetInfoResponse | { error: string }) => {
        if (d && !("error" in d) && d.room) {
          setCurrentRoomId(() => d.room.id);
        }
      }) as any,
    },
    [roomId]
  );
  const { push } = useRouter();

  useEffect(() => {
    if (roomId) {
      setCurrentRoomId(roomId);
    }
  }, [roomId, setCurrentRoomId]);

  const errMsg = data && "error" in data ? data.error : "";
  const noData = !data;

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (noData) {
      setCurrentRoomId(null);
      push("/dash");
      return;
    }
    if (errMsg) {
      setCurrentRoomId(null);
      console.log(errMsg, isLoading);
      showErrorToast(errMsg);
      push("/dash");
    }
  }, [noData, errMsg, isLoading, push, setCurrentRoomId]);

  return { data, isLoading };
};
