import React, { useContext, useEffect, useRef, useState } from "react";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { AudioRender2 } from "./components/AudioRender2";
import { useAudioStreamStore } from "./stores/useAudioStreamStore";

interface App2Props {}

export const WebRtcApp2: React.FC<App2Props> = () => {
  const { conn } = useContext(WebSocketContext);
  const peerConn = useRef<RTCPeerConnection | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((x) => {
        setMicStream(x);
      });
  }, []);

  useEffect(() => {
    if (!conn || !micStream) {
      return;
    }

    const unsubs = [
      conn.addListener<any>(
        "webrtc:candidate:in",
        async ({ candidate, sdpMLineIndex }) => {
          try {
            if (!peerConn.current) {
              throw new Error(
                "Received new remote candidate but RTCConnection is undefined"
              );
            }
            await peerConn.current.addIceCandidate(
              new RTCIceCandidate({
                candidate,
                sdpMLineIndex,
              })
            );
          } catch (err) {
            console.log("err name: ", err.name);
            console.error(err);
          }
        }
      ),
      conn.addListener<any>("webrtc:offer:in", async (offer) => {
        if (!peerConn.current) {
          peerConn.current = new RTCPeerConnection({
            iceServers: [
              {
                urls: "stun:stun.l.google.com:19302",
              },
            ],
          });
          peerConn.current.onicecandidate = (
            event: RTCPeerConnectionIceEvent
          ) => {
            if (event.candidate) {
              conn.sendCast("webrtc:signal", { data: event.candidate });
            }
          };
          peerConn.current.ontrack = (event: RTCTrackEvent) => {
            console.log(event);
            const [stream] = event.streams;
            useAudioStreamStore.getState().add(stream, "ben");
            // const mid = event.transceiver.mid!;
            // const isScreenSharing = mid.includes("SCREEN") || false;
            // if (isScreenSharing) {
            //   this.screensharingStream = stream;
            // } else {
            //   this.remoteStreams.add(stream);
            // }
            // this.midToStream.set(mid, stream);
            // stream.onremovetrack = (event) => {
            //   const hasTracks = stream.getTracks().length > 0;
            //   if (!hasTracks) {
            //     if (isScreenSharing) {
            //       this.screensharingStream = undefined;
            //     } else {
            //       this.remoteStreams.delete(stream);
            //     }
            //     this.midToStream.delete(mid);
            //     stream.onremovetrack = null;
            //   }
            //   this.callbacks.onRemoveTrack?.({
            //     track: event.track,
            //     stream,
            //     isScreenSharing,
            //   });
            // };
            // const label =
            //   this.participants.find((p) => p.mids.includes(mid))
            //     ?.displayName || "";
            // this.callbacks.onAddTrack?.({
            //   track: event.track,
            //   label,
            //   stream,
            //   isScreenSharing,
            // });
            // if (
            //   this.remoteStreams.size <= this.maxDisplayNum &&
            //   !isScreenSharing
            // ) {
            //   this.callbacks.onDisplayTrack?.({
            //     track: event.track,
            //     label,
            //     stream,
            //     isScreenSharing,
            //   });
            // }
          };
          // this.localTracks.forEach((track) =>
          // );
          peerConn.current.addTrack(micStream.getTracks()[0], micStream);
        } else {
          peerConn.current.createOffer({ iceRestart: true });
        }

        try {
          await peerConn.current.setRemoteDescription(offer.data);
          const answer = await peerConn.current.createAnswer();
          await peerConn.current.setLocalDescription(answer);

          conn.sendCast("webrtc:signal", { data: answer });
        } catch (error) {
          console.error(error);
        }
      }),
    ];

    return () => {
      unsubs.forEach((x) => x());
    };
  }, [conn, micStream]);

  return (
    <>
      <AudioRender2 />
    </>
  );
};
