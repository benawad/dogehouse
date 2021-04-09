import amqp, { Connection } from "amqplib";
import * as Sentry from "@sentry/node";
import {
  DtlsParameters,
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from "mediasoup/lib/types";
import { VoiceSendDirection } from "src/types";
import { TransportOptions } from "./createTransport";
import { Consumer } from "./createConsumer";

const retryInterval = 5000;
export interface HandlerDataMap {
  "remove-speaker": { roomId: string; peerId: string };
  "destroy-room": { roomId: string };
  "close-peer": { roomId: string; peerId: string; kicked?: boolean };
  "@get-recv-tracks": {
    roomId: string;
    peerId: string;
    rtpCapabilities: RtpCapabilities;
  };
  "@send-track": {
    roomId: string;
    peerId: string;
    transportId: string;
    direction: VoiceSendDirection;
    paused: boolean;
    kind: MediaKind;
    rtpParameters: RtpParameters;
    rtpCapabilities: RtpCapabilities;
    appData: any;
  };
  "@connect-transport": {
    roomId: string;
    dtlsParameters: DtlsParameters;
    peerId: string;
    direction: VoiceSendDirection;
  };
  "create-room": {
    roomId: string;
  };
  "add-speaker": {
    roomId: string;
    peerId: string;
  };
  "join-as-speaker": {
    roomId: string;
    peerId: string;
  };
  "join-as-new-peer": {
    roomId: string;
    peerId: string;
  };
}

export type HandlerMap = {
  [Key in keyof HandlerDataMap]: (
    d: HandlerDataMap[Key],
    uid: string,
    send: <Key extends keyof OutgoingMessageDataMap>(
      obj: OutgoingMessage<Key>
    ) => void,
    errBack: () => void
  ) => void;
};

type SendTrackDoneOperationName = `@send-track-${VoiceSendDirection}-done`;
type ConnectTransportDoneOperationName = `@connect-transport-${VoiceSendDirection}-done`;

type OutgoingMessageDataMap = {
  "you-joined-as-speaker": {
    roomId: string;
    peerId: string;
    routerRtpCapabilities: RtpCapabilities;
    recvTransportOptions: TransportOptions;
    sendTransportOptions: TransportOptions;
  };
  error: string;
  "room-created": {
    roomId: string;
  };
  "@get-recv-tracks-done": {
    consumerParametersArr: Consumer[];
    roomId: string;
  };
  close_consumer: {
    producerId: string;
    roomId: string;
  };
  "new-peer-speaker": {
    roomId: string;
  } & Consumer;
  you_left_room: {
    roomId: string;
    kicked: boolean;
  };
  "you-are-now-a-speaker": {
    sendTransportOptions: TransportOptions;
    roomId: string;
  };
  "you-joined-as-peer": {
    roomId: string;
    peerId: string;
    routerRtpCapabilities: RtpCapabilities;
    recvTransportOptions: TransportOptions;
  };
} & {
  [Key in SendTrackDoneOperationName]: {
    error?: string;
    id?: string;
    roomId: string;
  };
} &
  {
    [Key in ConnectTransportDoneOperationName]: {
      error?: string;
      roomId: string;
    };
  };

type OutgoingMessage<Key extends keyof OutgoingMessageDataMap> = {
  op: Key;
  d: OutgoingMessageDataMap[Key];
} & ({ uid: string } | { rid: string });
interface IncomingChannelMessageData<Key extends keyof HandlerMap> {
  op: Key;
  d: HandlerDataMap[Key];
  uid: string;
}

export let send = <Key extends keyof OutgoingMessageDataMap>(
  _obj: OutgoingMessage<Key>
) => {};

export const startRabbit = async (handler: HandlerMap) => {
  console.log(
    "trying to connect to: ",
    process.env.RABBITMQ_URL || "amqp://localhost"
  );
  let conn: Connection;
  try {
    conn = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
  } catch (err) {
    console.error("Unable to connect to RabbitMQ: ", err);
    setTimeout(async () => await startRabbit(handler), retryInterval);
    return;
  }
  const id = process.env.QUEUE_ID || "";
  console.log("rabbit connected " + id);
  conn.on("close", async function (err: Error) {
    console.error("Rabbit connection closed with error: ", err);
    setTimeout(async () => await startRabbit(handler), retryInterval);
  });
  const channel = await conn.createChannel();
  const sendQueue = "kousa_queue" + id;
  const onlineQueue = "kousa_online_queue" + id;
  const receiveQueue = "shawarma_queue" + id;
  console.log(sendQueue, onlineQueue, receiveQueue);
  await Promise.all([
    channel.assertQueue(receiveQueue),
    channel.assertQueue(sendQueue),
    channel.assertQueue(onlineQueue),
  ]);
  send = <Key extends keyof OutgoingMessageDataMap>(
    obj: OutgoingMessage<Key>
  ) => {
    channel.sendToQueue(sendQueue, Buffer.from(JSON.stringify(obj)));
  };
  await channel.purgeQueue(receiveQueue);
  await channel.consume(
    receiveQueue,
    async (e) => {
      const m = e?.content.toString();
      if (m) {
        let data: IncomingChannelMessageData<any> | undefined;
        try {
          data = JSON.parse(m);
        } catch {}
        // console.log(data.op);
        if (data && data.op && data.op in handler) {
          const { d: handlerData, op: operation, uid } = data;
          try {
            console.log(operation);
            await handler[operation as keyof HandlerMap](
              handlerData,
              uid,
              send,
              () => {
                console.log(operation);
                send({
                  op: "error",
                  d:
                    "The voice server is probably redeploying, it should reconnect in a few seconds. If not, try refreshing.",
                  uid: uid,
                });
              }
            );
          } catch (err) {
            console.log(operation, err);
            Sentry.captureException(err, { extra: { op: operation } });
          }
        }
      }
    },
    { noAck: true }
  );
  channel.sendToQueue(
    onlineQueue,
    Buffer.from(JSON.stringify({ op: "online" }))
  );
};
