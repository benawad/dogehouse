import { wrap } from "@dogehouse/kebab";
import { useCallback, useContext } from "react";
import { useQuery, useQueryClient, UseQueryOptions } from "react-query";
import { WebSocketContext } from "../modules/ws/WebSocketProvider";
import { Await } from "../types/util-types";
import { useWrappedConn } from "./useConn";

type Keys = keyof ReturnType<typeof wrap>["query"];

type PaginatedKey<K extends Keys> = [K, ...(string | number | boolean)[]];

export const useTypeSafeUpdateQuery = () => {
  const client = useQueryClient();
  return useCallback(
    <K extends Keys>(
      key: K | PaginatedKey<K>,
      fn: (
        x: Await<ReturnType<ReturnType<typeof wrap>["query"][K]>>
      ) => Await<ReturnType<ReturnType<typeof wrap>["query"][K]>>
    ) => {
      client.setQueryData<
        Await<ReturnType<ReturnType<typeof wrap>["query"][K]>>
      >(key, fn as any);
    },
    [client]
  );
};
