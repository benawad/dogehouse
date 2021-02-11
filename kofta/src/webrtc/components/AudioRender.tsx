import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { tw } from "twind";
import { Button } from "../../vscode-webview/components/Button";
import { volumeAtom } from "../../vscode-webview/shared-atoms";
import { useAudioTracks } from "../stores/useAudioTracks";

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
      myRef.current.volume = volume / 100;
    }
  }, [volume]);
  // useEffect(() => {
  //   if (myRef.current) {
  //     myRef.current.srcObject = new MediaStream([track]);
  //     myRef.current.play().catch((error) => {
  //       if (error.name === "NotAllowedError") {
  //         onAutoPlayError();
  //       } else {
  //         // Handle a load or playback error
  //       }
  //       console.warn("audioElem.play() failed:%o", error);
  //     });
  //   }
  // }, [track, playAgain]);
  return (
    <audio
      ref={(r) => {
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
  const hasShownAutoPlayModalBefore = useRef(false);
  const [showAutoPlayModal, setShowAutoPlayModal] = useState(false);
  const [volume] = useAtom(volumeAtom);
  const { tracks } = useAudioTracks();
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  return (
    <>
      <div
        className={tw`absolute w-full h-full flex z-50`}
        style={{
          backgroundColor: "rgba(0,0,0,.5)",
          display: showAutoPlayModal ? "" : "none",
        }}
      >
        <div
          className={tw`p-8 rounded m-auto`}
          style={{
            backgroundColor: "var(--vscode-dropdown-border)",
          }}
        >
          <div className={tw`text-center mb-4`}>
            Browsers require user interaction before they will play audio. Just
            click okay to continue.
          </div>
          <Button
            onClick={() => {
              setShowAutoPlayModal(false);
              audioRefs.current.forEach((a) => {
                a.play().catch((err) => {
                  console.warn(err);
                });
              });
            }}
          >
            okay
            {tracks.map((t) => (
              <MyAudio
                volume={volume}
                autoPlay
                playsInline
                controls={false}
                key={t.id}
                onRef={(a) => {
                  audioRefs.current.push(a);
                  a.srcObject = new MediaStream([t]);
                  a.play().catch((error) => {
                    if (
                      error.name === "NotAllowedError" &&
                      !hasShownAutoPlayModalBefore.current
                    ) {
                      hasShownAutoPlayModalBefore.current = true;
                      setShowAutoPlayModal(true);
                    }
                    console.warn("audioElem.play() failed:%o", error);
                  });
                }}
              />
            ))}
          </Button>
        </div>
      </div>
    </>
  );
};
