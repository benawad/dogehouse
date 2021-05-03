import React, { useEffect, useRef, useState } from "react";
import { useGlobalVolumeStore } from "../../../global-stores/useGlobalVolumeStore";
import { Button } from "../../../ui/Button";
import { useConsumerStore } from "../stores/useConsumerStore";
import { useDeafStore } from "../../../global-stores/useDeafStore";
interface AudioRenderProps {}

const MyAudio = ({
  volume,
  onRef,
  ...props
}: React.DetailedHTMLProps<
  React.AudioHTMLAttributes<HTMLAudioElement>,
  HTMLAudioElement
> & {
  onRef: (a: HTMLAudioElement) => void;
  volume: number;
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
  const { consumerMap, setAudioRef } = useConsumerStore();
  const audioRefs = useRef<[string, HTMLAudioElement][]>([]);
  const { deafened } = useDeafStore();

  return (
    <>
      <div
        className={`absolute top-0 w-full h-full flex z-50 bg-primary-900 ${
          showAutoPlayModal ? "" : "hidden"
        }`}
      >
        <div className={`flex p-8 rounded m-auto bg-primary-700 flex-col`}>
          <div className={`flex text-center mb-4 text-primary-100`}>
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
              const { consumer, volume: userVolume } = consumerMap[k];
              return (
                <MyAudio
                  volume={
                    deafened ? 0 : (userVolume / 200) * (globalVolume / 100)
                  }
                  // autoPlay
                  playsInline
                  controls={false}
                  key={consumer.id}
                  onRef={(a) => {
                    setAudioRef(k, a);
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
