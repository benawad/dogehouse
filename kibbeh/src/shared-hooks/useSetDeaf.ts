import { Wrapper } from "@dogehouse/kebab";
import { useDeafStore } from "../global-stores/useDeafStore";
import { useWrappedConn } from "./useConn";

export const setDeaf = (conn: Wrapper, value: boolean) => {
  useDeafStore.getState().setInternalDeaf(value);
  conn.mutation.setDeaf(value);
};

export const useSetDeaf = () => {
  const conn = useWrappedConn();
  return (value: boolean) => {
    setDeaf(conn, value);
  };
};
