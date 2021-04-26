import { Wrapper } from "@dogehouse/kebab";
import { useDeafStore } from "../global-stores/useDeafStore";
import { useMuteStore } from "../global-stores/useMuteStore";
import { useWrappedConn } from "./useConn";

export const useSetMute = () => {
  const conn = useWrappedConn();
  const { setInternalMute } = useMuteStore();
  const { setInternalDeaf } = useDeafStore();
  const { deafened } = useDeafStore();
  return (mute: boolean) => {
    // auto undeafen on unmute
    let playSound = true;
    if (!mute && deafened) {
      setInternalDeaf(false);
      conn.mutation.setDeaf(false);
      playSound = false;
    }
    setInternalMute(mute, playSound);
    conn.mutation.setMute(mute);
  };
};

export const setMute = (conn: Wrapper, value: boolean) => {
  // auto undeafen on unmute
  let playSound = true;
  if (!value) {
    useDeafStore.getState().setInternalDeaf(false);
    conn.mutation.setDeaf(false);
    playSound = false;
  }
  useMuteStore.getState().setInternalMute(value, playSound);
  conn.mutation.setMute(value);
};
