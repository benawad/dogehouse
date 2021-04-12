import isElectron from "is-electron";
import { useCallback } from "react";
import { useCurrentRoomIdStore } from "../global-stores/useCurrentRoomIdStore";
import { useRoomChatStore } from "../modules/room/chat/useRoomChatStore";
import { closeVoiceConnections } from "../modules/webrtc/WebRtcApp";
import { useTypeSafeMutation } from "./useTypeSafeMutation";

export const useLeaveRoom = () => {
  const { mutateAsync, isLoading } = useTypeSafeMutation("leaveRoom");

  return {
    leaveRoom: useCallback(() => {
      if (isElectron()) {
        const ipcRenderer = window.require("electron").ipcRenderer;
        ipcRenderer.send("@room/joined", false);
      }
      mutateAsync([]);
      useCurrentRoomIdStore.getState().setCurrentRoomId(null);
      useRoomChatStore.getState().reset();
      closeVoiceConnections(null);
    }, [mutateAsync]),
    isLoading,
  };
};
