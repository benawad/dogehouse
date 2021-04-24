import {
  ConsumerType,
  Producer,
  Router,
  RtpCapabilities,
  RtpParameters,
  Transport,
} from "mediasoup/lib/types";
import { MyPeer } from "../MyPeer";

export const createConsumer = async (
  router: Router,
  producer: Producer,
  rtpCapabilities: RtpCapabilities,
  transport: Transport,
  peerId: string,
  peerConsuming: MyPeer
): Promise<Consumer> => {
  if (!router.canConsume({ producerId: producer.id, rtpCapabilities })) {
    throw new Error(
      `recv-track: client cannot consume ${producer.appData.peerId}`
    );
  }

  const consumer = await transport.consume({
    producerId: producer.id,
    rtpCapabilities,
    paused: false, // see note above about always starting paused
    appData: { peerId, mediaPeerId: producer.appData.peerId },
  });

  // consumer.on("transportclose", () => {
  //   log(`consumer's transport closed`, consumer.id);
  //   closeConsumer(consumer, peerConsuming);
  // });
  // consumer.on("producerclose", () => {
  //   log(`consumer's producer closed`, consumer.id);
  //   closeConsumer(consumer, peerConsuming);
  // });

  peerConsuming.consumers.push(consumer);

  return {
    peerId: producer.appData.peerId,
    consumerParameters: {
      producerId: producer.id,
      id: consumer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
      producerPaused: consumer.producerPaused,
    },
  };
};

export interface Consumer {
  peerId: string;
  consumerParameters: {
    producerId: string;
    id: string;
    kind: string;
    rtpParameters: RtpParameters;
    type: ConsumerType;
    producerPaused: boolean;
  };
};
