import React, { useEffect, useState } from "react";
import { useVoiceStore } from "../webrtc/stores/useVoiceStore";

interface AudioDebugPanelProps {}

export const AudioDebugPanel: React.FC<AudioDebugPanelProps> = ({}) => {
  const [, rerender] = useState(0);
  const { recvTransport } = useVoiceStore();

  useEffect(() => {
    if (!recvTransport) {
      return;
    }

    const listener = () => {
      rerender((c) => c + 1);
    };

    recvTransport.on("connectionstatechange", listener);

    return () => {
      recvTransport.removeListener("connectionstatechange", listener);
    };
  }, [recvTransport]);

  return (
    <div className="text-primary-100 bg-primary-600 p-1 mb-2">
      <h4>Audio Debug Information</h4>
      <div>
        recv transport state:{" "}
        <span className="text-accent">{recvTransport?.connectionState}</span>
      </div>
    </div>
  );
};
