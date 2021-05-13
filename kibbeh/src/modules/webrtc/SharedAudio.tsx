import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useDeafStore } from "../../global-stores/useDeafStore";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { disconnectWebRTC } from "../../lib/disconnectEverything";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { ActiveSpeakerListener } from "./components/ActiveSpeakerListener";
import { useVoiceStore } from "./stores/useVoiceStore";

interface SharedAudioProps {}

export const SharedAudio: React.FC<SharedAudioProps> = ({}) => {
  const { muted } = useMuteStore();
  const { mic } = useVoiceStore();
  const { deafened } = useDeafStore();
  const { conn } = useContext(WebSocketContext);
  const { push } = useRouter();

  useEffect(() => {
    if (mic) {
      mic.enabled = !muted && !deafened;
    }
  }, [mic, muted, deafened]);

  useEffect(() => {
    if (!conn) {
      return;
    }

    return conn.addListener<any>("you_left_room", (d) => {
      if (d.kicked) {
        const { currentRoomId } = useCurrentRoomIdStore.getState();
        if (currentRoomId !== d.roomId) {
          return;
        }
        useCurrentRoomIdStore.getState().setCurrentRoomId(null);
        disconnectWebRTC(d.roomId);
        push("/dash");
      }
    });
  }, [conn, push]);

  return <ActiveSpeakerListener />;
};
