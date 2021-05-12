import React, { useContext, useEffect, useRef, useState } from "react";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { AudioRender2 } from "./components/AudioRender2";
import { useAudioStreamStore } from "./stores/useAudioStreamStore";
import { useMicIdStore } from "./stores/useMicIdStore";
import { useVoiceStore } from "./stores/useVoiceStore";

interface App2Props {}

export const WebRtcApp2: React.FC<App2Props> = () => {
  const { conn } = useContext(WebSocketContext);
  const peerConn = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!conn) {
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
        if (peerConn.current) {
          peerConn.current.close();
        }
        const { micId } = useMicIdStore.getState();
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: micId ? { deviceId: micId } : true,
        });
        useVoiceStore.getState().set({
          micStream: mediaStream,
          mic: mediaStream.getAudioTracks()[0],
        });
        // eslint-disable-next-line require-atomic-updates
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
          const [stream] = event.streams;
          useAudioStreamStore.getState().add(stream, "ben");
        };
        if (offer.peerType === "speaker") {
          const { micStream, mic } = useVoiceStore.getState();
          if (micStream && mic) {
            peerConn.current.addTrack(mic, micStream);
          }
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
  }, [conn]);

  return (
    <>
      <AudioRender2 />
    </>
  );
};
