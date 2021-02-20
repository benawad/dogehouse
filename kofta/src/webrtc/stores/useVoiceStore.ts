import { Device } from "mediasoup-client";
import { Transport } from "mediasoup-client/lib/types";
import create from "zustand";
import { combine } from "zustand/middleware";

export const useVoiceStore = create(
  combine(
    {
      roomId: "",
      micStream: null as MediaStream | null,
      mic: null as MediaStreamTrack | null,
      recvTransport: null as Transport | null,
      sendTransport: null as Transport | null,
      device: new Device(),
    },
    (set) => ({
      nullify: () =>
        set({
          recvTransport: null,
          sendTransport: null,
          roomId: "",
          mic: null,
          micStream: null,
        }),
      set,
    })
  )
);
