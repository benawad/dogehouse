import { wrap } from "@dogehouse/kebab";
import { useCallback } from "react";
import { useQueryClient } from "react-query";
import { Await } from "../types/util-types";

type Keys = keyof ReturnType<typeof wrap>["query"];

type PaginatedKey<K extends Keys> = [K, string | number];

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
