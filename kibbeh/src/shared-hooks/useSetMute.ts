import { Wrapper } from "@dogehouse/kebab";
import { useMuteStore } from "../global-stores/useMuteStore";
import { useWrappedConn } from "./useConn";

export const useSetMute = () => {
  const conn = useWrappedConn();
  const { setInternalMute } = useMuteStore();
  return (mute: boolean) => {
    setInternalMute(mute);
    conn.mutation.setMute(mute);
  };
};

export const setMute = (conn: Wrapper, value: boolean) => {
  useMuteStore.getState().setInternalMute(value);
  conn.mutation.setMute(value);
};
