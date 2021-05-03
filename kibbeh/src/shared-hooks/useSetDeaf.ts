import { Wrapper } from "@dogehouse/kebab";
import { useDeafStore } from "../global-stores/useDeafStore";
import { useMuteStore } from "../global-stores/useMuteStore";
import { useWrappedConn } from "./useConn";

export const setDeaf = (conn: Wrapper, value: boolean) => {
  const { muted, setInternalMute } = useMuteStore.getState();
  if (muted) {
    setInternalMute(false, false);
    conn.mutation.setMute(false);
  }
  useDeafStore.getState().setInternalDeaf(value);
  conn.mutation.setDeaf(value);
};

export const useSetDeaf = () => {
  const conn = useWrappedConn();
  return (value: boolean) => {
    setDeaf(conn, value);
  };
};
