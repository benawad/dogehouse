import { Wrapper } from "@dogehouse/kebab";
import { useDeafStore } from "../global-stores/useDeafStore";
import { useMuteStore } from "../global-stores/useMuteStore";
import { useWrappedConn } from "./useConn";
import { setDeaf } from "./useSetDeaf";

export const useSetMute = () => {
  const conn = useWrappedConn();
  const { setInternalMute } = useMuteStore();
  const { deafened } = useDeafStore();
  return (mute: boolean) => {
    // auto undeafen on unmute
    let playSound = true;
    if (!mute && deafened) {
      setDeaf(conn, false);
      playSound = false;
    }
    setInternalMute(mute, playSound);
    conn.mutation.setMute(mute);
  };
};

export const setMute = (conn: Wrapper, value: boolean) => {
  // auto undeafen on unmute
  const { deafened } = useDeafStore.getState();
  let playSound = true;
  if (!value && deafened) {
    setDeaf(conn, false);
    playSound = false;
  }
  useMuteStore.getState().setInternalMute(value, playSound);
  conn.mutation.setMute(value);
};
