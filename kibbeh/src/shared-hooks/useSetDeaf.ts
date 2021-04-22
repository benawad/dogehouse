import { Wrapper } from "@dogehouse/kebab";
import { useDeafStore } from "../global-stores/useDeafStore";
import { useWrappedConn } from "./useConn";

export const useSetDeaf = () => {
  const conn = useWrappedConn();
  const { setInternalDeaf } = useDeafStore();
  return (deaf: boolean) => {
    setInternalDeaf(deaf);
    conn.mutation.setDeaf(deaf);
  };
};

export const setDeaf = (conn: Wrapper, value: boolean) => {
  useDeafStore.getState().setInternalDeaf(value);
  conn.mutation.setDeaf(value);
};
