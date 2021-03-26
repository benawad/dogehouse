import { Device, Transport } from "mediasoup-client/lib/types";
import { ConnectFunction, ConsumerPlayer } from "./interface";
import { RoomPeer } from "..";

export const makeConsumer = (transport: Transport) => async (data: RoomPeer) => ({
  user: data.peerId,
  consumer: await transport.consume({
    ...data.consumerParameters,
    appData: {
      peerId: data.peerId,
      producerId: data.consumerParameters.producerId,
      mediaTag: "cam-audio"
    }
  })
});

export const connect: ConnectFunction<(device: Device) => Promise<void>> = (
  connection,
  routerRtpCapabilities,
  direction,
  transportOptions,
  track
) => async (device) => {
  if(!device.loaded) await device.load({ routerRtpCapabilities });

  const simplerDirection = direction === "output" ? "recv" : "send";
  const transport = direction === "output"
    ? device.createRecvTransport(transportOptions)
    : device.createSendTransport(transportOptions);

  transport.on("connect", async ({ dtlsParameters }, resolve, reject) => {
    const { error } = await connection.fetch(
      "@connect-transport",
      { transportId: transportOptions.id, dtlsParameters, direction: simplerDirection },
      `@connect-transport-${simplerDirection}-done`
    ) as { error?: string };

    if(error) {
      console.error(error);
      reject();
    } else {
      resolve();
    }
  });

  if(direction === "input") {
    transport.on("produce", async ({ kind, rtpParameters, appData }, resolve, reject) => {
      const { error } = await connection.fetch(
        "@send-track",
        {
          transportId: transportOptions.id,
          kind,
          rtpParameters,
          rtpCapabilities: device.rtpCapabilities,
          paused: false,
          appData,
          direction: simplerDirection
        },
        "@send-track-send-done"
      ) as { error?: string };

      if(error) {
        console.error(error);
        reject();
      } else {
        resolve();
      }
    });

    await transport.produce({
      track: track as MediaStreamTrack,
      appData: { mediaTag: "cam-audio" }
    });
  } else {
    const { consumerParametersArr } = await connection.fetch(
      "@get-recv-tracks",
      { rtpCapabilities: device.rtpCapabilities },
      "@get-recv-tracks-done"
    ) as { consumerParametersArr: Array<RoomPeer> };

    const consumers = await Promise.all(consumerParametersArr.map(makeConsumer(transport)));
    const unsubNps = connection.addListener("new-peer-speaker", async (data: RoomPeer) => {
      consumers.push(await makeConsumer(transport)(data));
    });

    const unsubYlr = connection.addListener("you_left_room", () => {
      unsubYlr();
      unsubNps();
    });

    const giveTrack = track as ConsumerPlayer;

    consumers.forEach(({ user, consumer }) => giveTrack(consumer.track, user));
  }
};
