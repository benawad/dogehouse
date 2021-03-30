import { useCallback } from "react";
import { useCurrentRoomIdStore } from "../global-stores/useCurrentRoomIdStore";
import { closeVoiceConnections } from "../modules/webrtc/WebRtcApp";
import { useTypeSafeMutation } from "./useTypeSafeMutation";

export const useLeaveRoom = () => {
  const { mutateAsync, isLoading } = useTypeSafeMutation("leaveRoom");

  return {
    leaveRoom: useCallback(() => {
      mutateAsync([]);
      useCurrentRoomIdStore.getState().setCurrentRoomId(null);
      closeVoiceConnections(null);
    }, [mutateAsync]),
    isLoading,
  };
};
