import { wrap } from "@dogehouse/kebab";
import { useContext } from "react";
import { useQuery, UseQueryOptions } from "react-query";
import { isServer } from "../lib/isServer";
import { WebSocketContext } from "../modules/ws/WebSocketProvider";
import { Await } from "../types/util-types";
import { useWrappedConn } from "./useConn";

type Keys = keyof ReturnType<typeof wrap>["query"];

type PaginatedKey<K extends Keys> = [K, ...(string | number | boolean)[]];

export const useTypeSafeQuery = <K extends Keys>(
  key: K | PaginatedKey<K>,
  opts?: UseQueryOptions,
  params?: Parameters<ReturnType<typeof wrap>["query"][K]>
) => {
  const conn = useWrappedConn();

  return useQuery<Await<ReturnType<ReturnType<typeof wrap>["query"][K]>>>(
    key,
    () => {
      const fn = conn.query[typeof key === "string" ? key : key[0]] as any;
      return fn(...(params || []));
    },
    {
      enabled: !!conn && !isServer,
      ...opts,
    } as any
  );
};
