import { Wrapper } from "@dogehouse/kebab";
import { useDeafStore } from "../global-stores/useDeafStore";
import { useMuteStore } from "../global-stores/useMuteStore";
import { useWrappedConn } from "./useConn";

export const useSetMute = () => {
  const conn = useWrappedConn();
  const { setInternalMute } = useMuteStore();
  const { setInternalDeaf } = useDeafStore();
  return (mute: boolean) => {
    setInternalMute(mute);
    conn.mutation.setMute(mute);

    if (!mute) {
      setInternalDeaf(false);
      conn.mutation.setDeaf(false);
    }
  };
};

export const setMute = (conn: Wrapper, value: boolean) => {
  useMuteStore.getState().setInternalMute(value);
  conn.mutation.setMute(value);
};
