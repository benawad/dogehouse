import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useMicIdStore } from "../app/shared-stores";
import { ActiveSpeakerListener } from "./components/ActiveSpeakerListener";
import { AudioRender } from "./components/AudioRender";
import { useCurrentRoomStore } from "./stores/useCurrentRoomStore";
import { useMuteStore } from "./stores/useMuteStore";
import { useVoiceStore } from "./stores/useVoiceStore";
import { useWsHandlerStore } from "./stores/useWsHandlerStore";
import { consumeAudio } from "./utils/consumeAudio";
import { createTransport } from "./utils/createTransport";
import { joinRoom } from "./utils/joinRoom";
import { receiveVoice } from "./utils/receiveVoice";
import { sendVoice } from "./utils/sendVoice";

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
  const addMultipleWsListener = useWsHandlerStore(
    (s) => s.addMultipleWsListener
  );
  const { mic } = useVoiceStore();
  const { micId } = useMicIdStore();
  const { muted } = useMuteStore();
  const { setCurrentRoom } = useCurrentRoomStore();
  const initialLoad = useRef(true);
  const history = useHistory();

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
    return addMultipleWsListener({
      you_left_room: (d) => {
        // assumes you don't rejoin the same room really quickly before websocket fires
        setCurrentRoom((cr) => {
          if (cr && cr.id === d.roomId) {
            history.replace("/");
            return null;
          }
          return cr;
        });
        closeVoiceConnections(d.roomId);
      },
      "new-peer-speaker": async (d) => {
        const { roomId, recvTransport } = useVoiceStore.getState();
        if (recvTransport && roomId === d.roomId) {
          await consumeAudio(d.consumerParameters, d.peerId);
        } else {
          consumerQueue.current = [...consumerQueue.current, { roomId, d: d }];
        }
      },
      "you-are-now-a-speaker": async (d) => {
        if (d.roomId !== useVoiceStore.getState().roomId) {
          return;
        }
        // setStatus("connected-speaker");
        try {
          await createTransport(d.roomId, "send", d.sendTransportOptions);
        } catch (err) {
          console.log(err);
          return;
        }
        console.log("sending voice");
        try {
          await sendVoice();
        } catch (err) {
          console.log(err);
          return;
        }
      },
      "you-joined-as-peer": async (d) => {
        closeVoiceConnections(null);
        useVoiceStore.getState().set({ roomId: d.roomId });
        // setStatus("connected-listener");
        consumerQueue.current = [];
        console.log("creating a device");
        try {
          await joinRoom(d.routerRtpCapabilities);
        } catch (err) {
          console.log("error creating a device | ", err);
          return;
        }
        try {
          await createTransport(d.roomId, "recv", d.recvTransportOptions);
        } catch (err) {
          console.log("error creating recv transport | ", err);
          return;
        }
        receiveVoice(() => flushConsumerQueue(d.roomId));
      },
      "you-joined-as-speaker": async (d) => {
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
          await createTransport(d.roomId, "send", d.sendTransportOptions);
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
        await createTransport(d.roomId, "recv", d.recvTransportOptions);
        receiveVoice(() => flushConsumerQueue(d.roomId));
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AudioRender />
      <ActiveSpeakerListener />
    </>
  );
};
