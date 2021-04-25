import { Wrapper } from "@dogehouse/kebab";
import { useDeafStore } from "../global-stores/useDeafStore";
import { useMuteStore } from "../global-stores/useMuteStore";
import { useWrappedConn } from "./useConn";

export const useSetDeaf = () => {
  const conn = useWrappedConn();
  const { setInternalDeaf } = useDeafStore();
  const { setInternalMute } = useMuteStore();
  return (deaf: boolean) => {
    setInternalDeaf(deaf);
    conn.mutation.setDeaf(deaf);

    if (deaf) {
      setInternalMute(true);
      conn.mutation.setMute(true);
    }
  };
};

export const setDeaf = (conn: Wrapper, value: boolean) => {
  useDeafStore.getState().setInternalDeaf(value);
  conn.mutation.setDeaf(value);
};
