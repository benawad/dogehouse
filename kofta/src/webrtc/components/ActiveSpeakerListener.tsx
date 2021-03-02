import hark from "hark";
import React, { useEffect } from "react";
import { wsend } from "../../createWebsocket";
import { useCurrentRoomStore } from "../stores/useCurrentRoomStore";
import { useVoiceStore } from "../stores/useVoiceStore";

interface ActiveSpeakerListenerProps {}

export const ActiveSpeakerListener: React.FC<ActiveSpeakerListenerProps> = ({}) => {
  const { micStream } = useVoiceStore();
  const { currentRoom: room } = useCurrentRoomStore();
  const roomId = room?.id;
  useEffect(() => {
    if (!roomId || !micStream) {
      return;
    }

    const harker = hark(micStream, { threshold: -65, interval: 75 });

    harker.on("speaking", () => {
      wsend({ op: "speaking_change", d: { value: true } });
    });

    harker.on("stopped_speaking", () => {
      wsend({ op: "speaking_change", d: { value: false } });
    });

    return () => {
      harker.stop();
    };
  }, [micStream, roomId]);

  return null;
};
