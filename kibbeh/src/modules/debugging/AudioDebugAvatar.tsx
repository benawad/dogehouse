import React, { useEffect, useState } from "react";
import hark from "hark";
import { useConsumerStore } from "../webrtc/stores/useConsumerStore";

interface AudioDebugAvatarProps {
  id: string;
}

const colorMap = {
  "no-consumer": "red",
  closed: "orange",
  good: "green",
};

export const AudioDebugAvatar: React.FC<AudioDebugAvatarProps> = ({
  id,
  children,
}) => {
  const [n, setN] = useState(0);
  const { consumerMap } = useConsumerStore();
  const consumer = consumerMap[id];
  let state = "";
  if (!consumer) {
    state = "no-consumer";
  } else if (consumer.consumer.closed) {
    state = "closed";
  } else {
    state = "good";
  }

  useEffect(() => {
    if (!consumer) {
      return;
    }
    const harker = hark(new MediaStream([consumer.consumer.track]));
    harker.setInterval(500);

    harker.on("volume_change", (x) => {
      const min = -100;
      const max = 100;

      // normalize between 0 and 1
      setN((x - min) / (max - min));
    });

    return () => {
      harker.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consumer?.consumer.id]);

  return (
    <div style={{ height: 60 }} className="relative">
      {children}
      <div className="rounded-full flex absolute top-0 h-full w-full opacity-70 overflow-hidden">
        <div
          className="mt-auto w-full"
          style={{
            height: 60 * n,
            backgroundColor: colorMap[state as keyof typeof colorMap] || "",
          }}
        />
      </div>
    </div>
  );
};
