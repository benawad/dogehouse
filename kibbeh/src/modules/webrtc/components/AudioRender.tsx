import React, { useEffect, useRef, useState } from "react";
import { useGlobalVolumeStore } from "../../../global-stores/useGlobalVolumeStore";
import { Button } from "../../../ui/Button";
import { useConsumerStore } from "../stores/useConsumerStore";

interface AudioRenderProps {}

const MyAudio = ({
  volume,
  onRef,
  debug,
  ...props
}: React.DetailedHTMLProps<
  React.AudioHTMLAttributes<HTMLAudioElement>,
  HTMLAudioElement
> & {
  onRef: (a: HTMLAudioElement) => void;
  volume: number;
  debug?: boolean;
}) => {
  const myRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (myRef.current) {
      myRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <audio
      ref={(r) => {
        if (debug && r) {
          console.log("audio-debug", {
            currentTime: r.currentTime,
            paused: r.paused,
            ended: r.ended,
            readyState: r.readyState,
            duration: r.duration,
            volume: r.volume,
          });
          if (r.dataset.debugPlay !== "true") {
            r.dataset.debugPlay = "true";
            r.play()
              .then(() => console.log("debug-play-then"))
              .catch((err) => {
                console.log("debug-play-catch", err);
              });
          }
        }
        // @todo
        if (r && !myRef.current) {
          (myRef as any).current = r;
          onRef(r);
        }
      }}
      {...props}
    />
  );
};

export const AudioRender: React.FC<AudioRenderProps> = () => {
  const notAllowedErrorCountRef = useRef(0);
  const [showAutoPlayModal, setShowAutoPlayModal] = useState(false);
  const { volume: globalVolume } = useGlobalVolumeStore();
  const { consumerMap } = useConsumerStore();
  const audioRefs = useRef<[string, HTMLAudioElement][]>([]);

  return (
    <>
      <div
        className={`absolute w-full h-full flex z-50 bg-primary-900 ${
          showAutoPlayModal ? "" : "hidden"
        }`}
      >
        <div className={`p-8 rounded m-auto bg-primary-700 flex-col`}>
          <div className={`text-center mb-4 text-primary-100`}>
            Browsers require user interaction before they will play audio. Just
            click okay to continue.
          </div>
          <Button
            onClick={() => {
              setShowAutoPlayModal(false);
              audioRefs.current.forEach(([_, a]) => {
                a.play().catch((err) => {
                  console.warn(err);
                });
              });
            }}
          >
            okay
            {Object.keys(consumerMap).map((k) => {
              const { consumer, volume: userVolume, debug } = consumerMap[k];
              return (
                <MyAudio
                  volume={(userVolume / 200) * (globalVolume / 100)}
                  // autoPlay
                  playsInline
                  controls={false}
                  key={consumer.id}
                  debug={debug}
                  onRef={(a) => {
                    audioRefs.current.push([k, a]);
                    a.srcObject = new MediaStream([consumer.track]);
                    // prevent modal from showing up more than once in a single render cycle
                    const notAllowedErrorCount =
                      notAllowedErrorCountRef.current;
                    a.play().catch((error) => {
                      if (
                        error.name === "NotAllowedError" &&
                        notAllowedErrorCountRef.current === notAllowedErrorCount
                      ) {
                        notAllowedErrorCountRef.current++;
                        setShowAutoPlayModal(true);
                      }
                      console.warn("audioElem.play() failed:%o", error);
                    });
                  }}
                />
              );
            })}
          </Button>
        </div>
      </div>
    </>
  );
};
