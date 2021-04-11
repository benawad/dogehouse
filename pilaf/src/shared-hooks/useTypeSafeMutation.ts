import { wrap } from "@dogehouse/kebab";
import { useContext } from "react";
import { useMutation, UseMutationOptions } from "react-query";
import { WebSocketContext } from "../modules/ws/WebSocketProvider";
import { Await } from "../types/util-types";

type Keys = keyof ReturnType<typeof wrap>["mutation"];

export const useTypeSafeMutation = <K extends Keys>(
  key: K,
  opts?: UseMutationOptions<
    Await<ReturnType<ReturnType<typeof wrap>["mutation"][K]>>,
    any,
    Parameters<ReturnType<typeof wrap>["mutation"][K]>,
    any
  >
) => {
  const { conn } = useContext(WebSocketContext);

  return useMutation<
    Await<ReturnType<ReturnType<typeof wrap>["mutation"][K]>>,
    any,
    Parameters<ReturnType<typeof wrap>["mutation"][K]>
  >(
    (params) =>
      (wrap(conn!).mutation[typeof key === "string" ? key : key[0]] as any)(
        ...params
      ),
    opts
  );
};
