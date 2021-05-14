import React, { useContext, useEffect, useRef, useState } from "react";
import { disconnectWebRTC } from "../../lib/disconnectEverything";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { AudioRender2 } from "./components/AudioRender2";
import { useAudioStreamStore } from "./stores/useAudioStreamStore";
import { useMicIdStore } from "./stores/useMicIdStore";
import { useVoiceStore } from "./stores/useVoiceStore";
import "webrtc-adapter";

interface App2Props {}

export const WebRtcApp2: React.FC<App2Props> = () => {
  const { conn } = useContext(WebSocketContext);
  const candidateQueue = useRef<RTCIceCandidate[]>([]);

  useEffect(() => {
    if (!conn) {
      return;
    }

    const unsubs = [
      conn.addListener<any>(
        "webrtc:candidate:in",
        async ({ candidate, sdpMLineIndex }) => {
          try {
            const peerConn = useVoiceStore.getState().peerConn;
            const ice = new RTCIceCandidate({
              candidate,
              sdpMLineIndex,
            });
            if (!peerConn) {
              candidateQueue.current.push(ice);
            } else {
              await peerConn.addIceCandidate(ice);
            }
          } catch (err) {
            console.log("err name: ", err.name);
            console.error(err);
          }
        }
      ),
      conn.addListener<any>("webrtc:offer:in", async (offer) => {
        // assumes webrtc:candidate:in does not happen before webrtc:offer:in
        candidateQueue.current = [];

        const { micId } = useMicIdStore.getState();
        const voiceStore = useVoiceStore.getState();
        const isNewRoom =
          !voiceStore.micStream || voiceStore.roomId !== offer.roomId;
        let peerConn = isNewRoom ? null : voiceStore.peerConn;
        let micStream = voiceStore.micStream;
        let mic = voiceStore.mic;

        if (isNewRoom) {
          disconnectWebRTC();
        }

        if ((offer.peerType === "speaker" && !micStream) || !mic) {
          micStream = await navigator.mediaDevices.getUserMedia({
            audio: micId ? { deviceId: micId } : true,
          });
          mic = micStream.getAudioTracks()[0];
          voiceStore.set({ mic, micStream });
        }
        if (!peerConn) {
          peerConn = new RTCPeerConnection({
            iceServers: [
              {
                urls: "stun:stun.l.google.com:19302",
              },
            ],
          });
          voiceStore.set({
            peerConn,
            roomId: offer.roomId,
          });
          peerConn.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
            if (event.candidate) {
              conn.sendCast("webrtc:signal", { data: event.candidate });
            }
          };
          peerConn.ontrack = (event: RTCTrackEvent) => {
            const [stream] = event.streams;
            const id = stream.id;
            useAudioStreamStore.getState().add(stream, id);
            stream.onremovetrack = () => {
              useAudioStreamStore.getState().remove(id);
            };
          };
          if (offer.peerType === "speaker") {
            if (micStream) {
              peerConn.addTrack(mic, micStream);
            }
          }
        } else {
          peerConn.createOffer({ iceRestart: true });
        }

        try {
          await peerConn.setRemoteDescription(offer.data);
          const answer = await peerConn.createAnswer();
          await peerConn.setLocalDescription(answer);

          conn.sendCast("webrtc:signal", { data: answer });
          candidateQueue.current.forEach((ice) => {
            peerConn!.addIceCandidate(ice).catch((err) => {
              console.log("err2 name: ", err.name);
              console.error(err);
            });
          });
          candidateQueue.current = [];
        } catch (error) {
          console.error(error);
        }
      }),
    ];

    return () => {
      unsubs.forEach((x) => x());
    };
  }, [conn]);

  return (
    <>
      <AudioRender2 />
    </>
  );
};
