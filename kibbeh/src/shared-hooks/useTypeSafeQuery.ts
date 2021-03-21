import { wrap } from "@dogehouse/kebab";
import { useContext } from "react";
import { useQuery, UseQueryOptions } from "react-query";
import { WebSocketContext } from "../modules/ws/WebSocketProvider";
import { Await } from "../types/util-types";

type Keys = keyof ReturnType<typeof wrap>["query"];

type PaginatedKey<K extends Keys> = [K, string | number];

export const useTypeSafeQuery = <K extends Keys>(
  key: K | PaginatedKey<K>,
  opts?: UseQueryOptions,
  params?: Parameters<ReturnType<typeof wrap>["query"][K]>
) => {
  const { conn } = useContext(WebSocketContext);

  return useQuery<Await<ReturnType<ReturnType<typeof wrap>["query"][K]>>>(
    key,
    () =>
      (wrap(conn!).query[typeof key === "string" ? key : key[0]] as any)(
        ...(params || [])
      ),
    {
      enabled: !!conn,
      ...opts,
    } as any
  );
};
