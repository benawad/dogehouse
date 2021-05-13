// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck because internet is unpredictable

import { raw } from "..";
import { RoomPeer, UUID } from "../entities";
import {
  TransportOptions,
  DtlsParameters,
  ConsumerOptions,
  RtpCapabilities,
  RtpParameters,
} from "mediasoup-client/lib/types";

/**
 * Allows you to handle custom logic on websocket voice events
 */
type Handler<Data> = (data: Data) => void;

/**
 * Creates a wrapper object that allows you to make websocket voice related calls using functions
 * @param {raw.Connection} connection - reference to the websocket connection
 * @returns {connection} Wrapper object
 */
export const wrap = (connection: raw.Connection) => ({
  connection,

  /**
   * Allows you to subscribe to various pre-defined websocket voice events
   */
  subscribe: {
    closeConsumer: (handler: Handler<{ producerId: UUID }>) =>
      connection.addListener("close_consumer", handler),
    newPeerSpeaker: (
      handler: Handler<{ peerId: UUID; consumerParameters: ConsumerOptions }>
    ) => connection.addListener("new-peer-speaker", handler),
    youJoinedAsPeer: (
      handler: Handler<{
        routerRtpCapabilities: RtpCapabilities;
        recvTransportOptions: TransportOptions;
      }>
    ) => connection.addListener("you-joined-as-peer", handler),
    youJoinedAsSpeaker: (
      handler: Handler<{
        routerRtpCapabilities: RtpCapabilities;
        recvTransportOptions: TransportOptions;
        sendTransportOptions: TransportOptions;
      }>
    ) => connection.addListener("you-joined-as-speaker", handler),
    youBecameSpeaker: (
      handler: Handler<{ sendTransportOptions: TransportOptions }>
    ) => connection.addListener("you-are-now-a-speaker", handler),
  },

  /**
   * Allows you to call functions that return information about the ws voice state
   */
  query: {
    getConsumersParameters: (
      rtpCapabilities: RtpCapabilities
    ): Promise<{ consumerParametersArr: RoomPeer[] }> =>
      connection.fetch(
        "@get-recv-tracks",
        { rtpCapabilities },
        "@get-recv-tracks-done"
      ),
  },

  /**
   * Allows you to call functions that mutate the ws voice state
   */
  mutation: {
    connectTransport: (
      transportId: UUID,
      direction: "send" | "recv",
      dtlsParameters: DtlsParameters
    ): Promise<{ error: string } | { roomId: UUID }> =>
      connection.fetch(
        "@connect-transport",
        { transportId, direction, dtlsParameters },
        `@connect-transport-${direction}-done`
      ),
    sendTrack: (
      transportId: UUID,
      kind: "audio",
      rtpParameters: RtpParameters,
      rtpCapabilities: RtpCapabilities,
      paused: false,
      appData: { mediaTag: "cam-audio" },
      direction: "send"
    ): Promise<{ id: UUID } | { error: string }> =>
      connection.fetch(
        "@send-track",
        {
          transportId,
          kind,
          rtpParameters,
          rtpCapabilities,
          paused,
          appData,
          direction,
        },
        `@send-track-${direction}-done`
      ),
  },
});
