import React, { useContext, useEffect, useRef } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { useMicIdStore } from "./stores/useMicIdStore";
import { useVoiceStore } from "./stores/useVoiceStore";
import { consumeAudio } from "./utils/consumeAudio";
import { createTransport } from "./utils/createTransport";
import { joinRoom } from "./utils/joinRoom";
import { receiveVoice } from "./utils/receiveVoice";
import { sendVoice } from "./utils/sendVoice";
import InCallManager from "react-native-incall-manager";

interface App2Props {}

function closeVoiceConnections(_roomId: string | null) {
  const { roomId, mic, nullify } = useVoiceStore.getState();
  if (_roomId === null || _roomId === roomId) {
    if (mic) {
      console.log("stopping mic");
      mic.stop();
    }

    console.log("nulling transports");
    nullify();
  }
}

export const WebRtcApp: React.FC<App2Props> = () => {
  const { conn } = useContext(WebSocketContext);
  const { mic } = useVoiceStore();
  const { micId } = useMicIdStore();
  const { muted } = useMuteStore();
  const { setCurrentRoomId } = useCurrentRoomIdStore();
  const initialLoad = useRef(true);

  useEffect(() => {
    if (micId && !initialLoad.current) {
      sendVoice();
    }
    initialLoad.current = false;
  }, [micId]);
  const consumerQueue = useRef<{ roomId: string; d: any }[]>([]);

  async function flushConsumerQueue(_roomId: string) {
    try {
      for (const {
        roomId,
        d: { peerId, consumerParameters },
      } of consumerQueue.current) {
        if (_roomId === roomId) {
          await consumeAudio(consumerParameters, peerId);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      consumerQueue.current = [];
    }
  }
  useEffect(() => {
    if (mic) {
      mic.enabled = !muted;
    }
  }, [mic, muted]);
  useEffect(() => {
    if (!conn) {
      return;
    }

    const unsubs = [
      // @todo fix
      conn.addListener<any>("you_left_room", (d) => {
        // assumes you don't rejoin the same room really quickly before websocket fires
        setCurrentRoomId((id) => {
          if (id === d.roomId) {
            return null;
          }
          return id;
        });
        closeVoiceConnections(d.roomId);
        InCallManager.stop();
      }),
      conn.addListener<any>("new-peer-speaker", async (d) => {
        const { roomId, recvTransport } = useVoiceStore.getState();
        if (recvTransport && roomId === d.roomId) {
          await consumeAudio(d.consumerParameters, d.peerId);
        } else {
          consumerQueue.current = [...consumerQueue.current, { roomId, d }];
        }
        InCallManager.start({ media: "audio" });
      }),
      conn.addListener<any>("you-are-now-a-speaker", async (d) => {
        if (d.roomId !== useVoiceStore.getState().roomId) {
          return;
        }
        // setStatus("connected-speaker");
        try {
          await createTransport(conn, d.roomId, "send", d.sendTransportOptions);
        } catch (err) {
          console.log(err);
          return;
        }
        InCallManager.start({ media: "audio" });
        console.log("sending voice");
        try {
          await sendVoice();
        } catch (err) {
          console.log(err);
        }
      }),
      conn.addListener<any>("you-joined-as-peer", async (d) => {
        closeVoiceConnections(null);
        useVoiceStore.getState().set({ roomId: d.roomId });

        consumerQueue.current = [];
        console.log("creating a device");
        try {
          await joinRoom(d.routerRtpCapabilities);
        } catch (err) {
          console.log("error creating a device | ", err);
          return;
        }
        try {
          await createTransport(conn, d.roomId, "recv", d.recvTransportOptions);
        } catch (err) {
          console.log("error creating recv transport | ", err);
          return;
        }
        InCallManager.start({ media: "audio" });
        receiveVoice(conn, () => flushConsumerQueue(d.roomId));
      }),
      conn.addListener<any>("you-joined-as-speaker", async (d) => {
        closeVoiceConnections(null);
        useVoiceStore.getState().set({ roomId: d.roomId });
        // setStatus("connected-speaker");
        consumerQueue.current = [];
        console.log("creating a device");
        try {
          await joinRoom(d.routerRtpCapabilities);
        } catch (err) {
          console.log("error creating a device | ", err);
          return;
        }
        try {
          await createTransport(conn, d.roomId, "send", d.sendTransportOptions);
        } catch (err) {
          console.log("error creating send transport | ", err);
          return;
        }
        console.log("sending voice");
        try {
          await sendVoice();
        } catch (err) {
          console.log("error sending voice | ", err);
          return;
        }
        await createTransport(conn, d.roomId, "recv", d.recvTransportOptions);
        InCallManager.start({ media: "audio" });
        receiveVoice(conn, () => flushConsumerQueue(d.roomId));
      }),
    ];

    return () => {
      unsubs.forEach((x) => x());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conn]);

  return <></>;
};
