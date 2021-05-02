import React, { useEffect, useState } from "react";
import { Button } from "../../ui/Button";
import { useConsumerStore } from "../webrtc/stores/useConsumerStore";

interface AudioDebugConsumerSectionProps {
  userId: string;
}

export const AudioDebugConsumerSection: React.FC<AudioDebugConsumerSectionProps> = ({
  userId,
}) => {
  const [, rerender] = useState(0);
  const { consumerMap } = useConsumerStore();
  const data = consumerMap[userId];

  useEffect(() => {
    const id = setInterval(() => {
      rerender((c) => c + 1);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  if (!data) {
    return null;
  }

  const { audioRef: r } = data;

  return (
    <div className="w-full">
      <pre className="text-primary-100 ">
        {r
          ? JSON.stringify(
              {
                currentTime: r.currentTime,
                paused: r.paused,
                ended: r.ended,
                readyState: r.readyState,
                duration: r.duration,
                volume: r.volume,
              },
              null,
              2
            )
          : "no audio ref"}
      </pre>
      <Button
        onClick={() => {
          r?.play().catch((err) =>
            console.log("force play audio error: ", err)
          );
        }}
        className={`w-full my-1 text-base`}
        color="secondary"
      >
        Force play audio
      </Button>
    </div>
  );
};
