import { useAtom } from "jotai";
import React, { useEffect } from "react";
import hark from "hark";
import { wsend } from "feta/createWebsocket";
import { currentRoomAtom } from "../../vscode-webview/atoms";
import { useVoiceStore } from "feta/webrtc/stores/useVoiceStore";

interface ActiveSpeakerListenerProps {}

export const ActiveSpeakerListener: React.FC<ActiveSpeakerListenerProps> = ({}) => {
  const { micStream } = useVoiceStore();
  const [room] = useAtom(currentRoomAtom);
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
