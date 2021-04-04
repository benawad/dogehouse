import { wrap } from "@dogehouse/kebab";
import { useCallback, useContext } from "react";
import { useQueryClient } from "react-query";
import { WebSocketContext } from "../modules/ws/WebSocketProvider";

type Keys = keyof ReturnType<typeof wrap>["query"];

type PaginatedKey<K extends Keys> = [K, string | number];

export const useTypeSafePrefetch = () => {
  const { conn } = useContext(WebSocketContext);
  const client = useQueryClient();

  return useCallback(
    <K extends Keys>(
      key: K | PaginatedKey<K>,
      params?: Parameters<ReturnType<typeof wrap>["query"][K]>
    ) =>
      client.prefetchQuery(
        key,
        () =>
          (wrap(conn!).query[typeof key === "string" ? key : key[0]] as any)(
            ...(params || [])
          ),
        { staleTime: 0 }
      ),
    [conn, client]
  );
};
