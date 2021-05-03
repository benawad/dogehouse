import "dotenv/config";
import debugModule from "debug";
import { Router, Worker } from "mediasoup/lib/types";
import * as Sentry from "@sentry/node";
import { MyRooms } from "./MyRoomState";
import { closePeer } from "./utils/closePeer";
import { createConsumer } from "./utils/createConsumer";
import { createTransport, transportToOptions } from "./utils/createTransport";
import { deleteRoom } from "./utils/deleteRoom";
import { startMediasoup } from "./utils/startMediasoup";
import { HandlerMap, startRabbit } from "./utils/startRabbit";

const log = debugModule("shawarma:index");
const errLog = debugModule("shawarma:ERROR");

const rooms: MyRooms = {};

export async function main() {
  if (process.env.SENTRY_DNS) {
    Sentry.init({
      dsn: process.env.SENTRY_DNS,
      enabled: !!process.env.SENTRY_DNS,
    });
  }
  // start mediasoup
  console.log("starting mediasoup");
  let workers: {
    worker: Worker;
    router: Router;
  }[];
  try {
    workers = await startMediasoup();
  } catch (err) {
    console.log(err);
    throw err;
  }
  let workerIdx = 0;

  const getNextWorker = () => {
    const w = workers[workerIdx];
    workerIdx++;
    workerIdx %= workers.length;
    return w;
  };

  const createRoom = () => {
    const { worker, router } = getNextWorker();

    return { worker, router, state: {} };
  };

  await startRabbit({
    "remove-speaker": ({ roomId, peerId }) => {
      if (roomId in rooms) {
        const peer = rooms[roomId].state[peerId];
        peer?.producer?.close();
        peer?.sendTransport?.close();
      }
    },
    ["destroy-room"]: ({ roomId }) => {
      if (roomId in rooms) {
        for (const peer of Object.values(rooms[roomId].state)) {
          closePeer(peer);
        }
        deleteRoom(roomId, rooms);
      }
    },
    ["close-peer"]: async ({ roomId, peerId, kicked }, uid, send) => {
      if (roomId in rooms) {
        if (peerId in rooms[roomId].state) {
          closePeer(rooms[roomId].state[peerId]);
          delete rooms[roomId].state[peerId];
        }
        if (Object.keys(rooms[roomId].state).length === 0) {
          deleteRoom(roomId, rooms);
        }
        send({ uid, op: "you_left_room", d: { roomId, kicked: !!kicked } });
      }
    },
    ["@get-recv-tracks"]: async (
      { roomId, peerId: myPeerId, rtpCapabilities },
      uid,
      send,
      errBack
    ) => {
      if (!rooms[roomId]?.state[myPeerId]?.recvTransport) {
        errBack();
        return;
      }

      const { state, router } = rooms[roomId];
      const transport = state[myPeerId].recvTransport;
      if (!transport) {
        errBack();
        return;
      }

      const consumerParametersArr = [];

      for (const theirPeerId of Object.keys(state)) {
        const peerState = state[theirPeerId];
        if (theirPeerId === myPeerId || !peerState || !peerState.producer) {
          continue;
        }
        try {
          const { producer } = peerState;
          consumerParametersArr.push(
            await createConsumer(
              router,
              producer,
              rtpCapabilities,
              transport,
              myPeerId,
              state[theirPeerId]
            )
          );
        } catch (e) {
          errLog(e.message);
          continue;
        }
      }

      send({
        op: "@get-recv-tracks-done",
        uid,
        d: { consumerParametersArr, roomId },
      });
    },
    ["@send-track"]: async (
      {
        roomId,
        transportId,
        direction,
        peerId: myPeerId,
        kind,
        rtpParameters,
        rtpCapabilities,
        paused,
        appData,
      },
      uid,
      send,
      errBack
    ) => {
      if (!(roomId in rooms)) {
        errBack();
        return;
      }
      const { state } = rooms[roomId];
      const { sendTransport, producer: previousProducer, consumers } = state[
        myPeerId
      ];
      const transport = sendTransport;

      if (!transport) {
        errBack();
        return;
      }
      try {
        if (previousProducer) {
          previousProducer.close();
          consumers.forEach((c) => c.close());
          // @todo give some time for frontends to get update, but this can be removed
          send({
            rid: roomId,
            op: "close_consumer",
            d: { producerId: previousProducer.id, roomId },
          });
        }

        const producer = await transport.produce({
          kind,
          rtpParameters,
          paused,
          appData: { ...appData, peerId: myPeerId, transportId },
        });

        rooms[roomId].state[myPeerId].producer = producer;
        for (const theirPeerId of Object.keys(state)) {
          if (theirPeerId === myPeerId) {
            continue;
          }
          const peerTransport = state[theirPeerId]?.recvTransport;
          if (!peerTransport) {
            continue;
          }
          try {
            const d = await createConsumer(
              rooms[roomId].router,
              producer,
              rtpCapabilities,
              peerTransport,
              myPeerId,
              state[theirPeerId]
            );
            send({
              uid: theirPeerId,
              op: "new-peer-speaker",
              d: { ...d, roomId },
            });
          } catch (e) {
            errLog(e.message);
          }
        }
        send({
          op: `@send-track-${direction}-done` as const,
          uid,
          d: {
            id: producer.id,
            roomId,
          },
        });
      } catch (e) {
        send({
          op: `@send-track-${direction}-done` as const,
          uid,
          d: {
            error: e.message,
            roomId,
          },
        });
        send({
          op: "error",
          d: "error connecting to voice server | " + e.message,
          uid,
        });
        return;
      }
    },
    ["@connect-transport"]: async (
      { roomId, dtlsParameters, peerId, direction },
      uid,
      send,
      errBack
    ) => {
      if (!rooms[roomId]?.state[peerId]) {
        errBack();
        return;
      }
      const { state } = rooms[roomId];
      const transport =
        direction === "recv"
          ? state[peerId].recvTransport
          : state[peerId].sendTransport;

      if (!transport) {
        errBack();
        return;
      }

      log("connect-transport", peerId, transport.appData);

      try {
        await transport.connect({ dtlsParameters });
      } catch (e) {
        console.log(e);
        send({
          op: `@connect-transport-${direction}-done` as const,
          uid,
          d: { error: e.message, roomId },
        });
        send({
          op: "error",
          d: "error connecting to voice server | " + e.message,
          uid,
        });
        return;
      }
      send({
        op: `@connect-transport-${direction}-done` as const,
        uid,
        d: { roomId },
      });
    },
    ["create-room"]: async ({ roomId }, uid, send) => {
      if (!(roomId in rooms)) {
        rooms[roomId] = createRoom();
      }
      send({ op: "room-created", d: { roomId }, uid });
    },
    ["add-speaker"]: async ({ roomId, peerId }, uid, send, errBack) => {
      if (!rooms[roomId]?.state[peerId]) {
        errBack();
        return;
      }
      log("add-speaker", peerId);

      const { router } = rooms[roomId];
      const sendTransport = await createTransport("send", router, peerId);
      rooms[roomId].state[peerId].sendTransport?.close();
      rooms[roomId].state[peerId].sendTransport = sendTransport;

      send({
        op: "you-are-now-a-speaker",
        d: {
          sendTransportOptions: transportToOptions(sendTransport),
          roomId,
        },
        uid,
      });
    },
    ["join-as-speaker"]: async ({ roomId, peerId }, uid, send) => {
      if (!(roomId in rooms)) {
        rooms[roomId] = createRoom();
      }
      log("join-as-new-peer", peerId);

      const { state, router } = rooms[roomId];
      const [recvTransport, sendTransport] = await Promise.all([
        createTransport("recv", router, peerId),
        createTransport("send", router, peerId),
      ]);
      if (state[peerId]) {
        closePeer(state[peerId]);
      }
      rooms[roomId].state[peerId] = {
        recvTransport: recvTransport,
        sendTransport: sendTransport,
        consumers: [],
        producer: null,
      };

      send({
        op: "you-joined-as-speaker",
        d: {
          roomId,
          peerId,
          routerRtpCapabilities: rooms[roomId].router.rtpCapabilities,
          recvTransportOptions: transportToOptions(recvTransport),
          sendTransportOptions: transportToOptions(sendTransport),
        },
        uid,
      });
    },
    ["join-as-new-peer"]: async ({ roomId, peerId }, uid, send) => {
      if (!(roomId in rooms)) {
        rooms[roomId] = createRoom();
      }
      log("join-as-new-peer", peerId);
      const { state, router } = rooms[roomId];
      const recvTransport = await createTransport("recv", router, peerId);
      if (state[peerId]) {
        closePeer(state[peerId]);
      }

      rooms[roomId].state[peerId] = {
        recvTransport,
        consumers: [],
        producer: null,
        sendTransport: null,
      };

      send({
        op: "you-joined-as-peer",
        d: {
          roomId,
          peerId,
          routerRtpCapabilities: rooms[roomId].router.rtpCapabilities,
          recvTransportOptions: transportToOptions(recvTransport),
        },
        uid,
      });
    },
  } as HandlerMap);
}
