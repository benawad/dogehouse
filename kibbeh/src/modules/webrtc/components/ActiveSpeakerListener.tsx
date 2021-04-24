import { wrap } from "@dogehouse/kebab";
import hark from "hark";
import React, { useContext, useEffect } from "react";
import { useCurrentRoomIdStore } from "../../../global-stores/useCurrentRoomIdStore";
import { useDebugAudioStore } from "../../../global-stores/useDebugAudio";
import { useConn } from "../../../shared-hooks/useConn";
import { WebSocketContext } from "../../ws/WebSocketProvider";
import { useVoiceStore } from "../stores/useVoiceStore";

interface ActiveSpeakerListenerProps {}

export const ActiveSpeakerListener: React.FC<ActiveSpeakerListenerProps> = ({}) => {
  const { conn } = useContext(WebSocketContext);
  const { micStream } = useVoiceStore();
  const { currentRoomId } = useCurrentRoomIdStore();
  const { debugAudio } = useDebugAudioStore();
  useEffect(() => {
    if (!currentRoomId || !micStream || !conn) {
      return;
    }

    const wrappedConn = wrap(conn);

    const harker = hark(micStream, { threshold: -65, interval: 75 });

    harker.on("speaking", () => {
      wrappedConn.mutation.speakingChange(true);
    });

    harker.on("stopped_speaking", () => {
      wrappedConn.mutation.speakingChange(false);
    });

    return () => {
      harker.stop();
    };
  }, [micStream, currentRoomId, conn]);

  return null;
};
