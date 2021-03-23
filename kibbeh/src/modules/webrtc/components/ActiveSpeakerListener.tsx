import { wrap } from "@dogehouse/kebab";
import hark from "hark";
import React, { useContext, useEffect } from "react";
import { useCurrentRoomStore } from "../../../global-stores/useCurrentRoomStore";
import { useConn } from "../../../shared-hooks/useConn";
import { WebSocketContext } from "../../ws/WebSocketProvider";
import { useVoiceStore } from "../stores/useVoiceStore";

interface ActiveSpeakerListenerProps {}

export const ActiveSpeakerListener: React.FC<ActiveSpeakerListenerProps> = ({}) => {
  const { conn } = useContext(WebSocketContext);
  const { micStream } = useVoiceStore();
  const { currentRoom: room } = useCurrentRoomStore();
  const roomId = room?.id;
  useEffect(() => {
    if (!roomId || !micStream || !conn) {
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
  }, [micStream, roomId, conn]);

  return null;
};
