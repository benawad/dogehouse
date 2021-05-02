import { Device, Transport } from "mediasoup-client/lib/types";
import { ConnectFunction, ConsumerPlayer } from "./interface";
import { RoomPeer } from "..";
import { wrap } from "./audioWrapper";

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

  const wrapper = wrap(connection);
  const simplerDirection = direction === "output" ? "recv" : "send";
  const transport = direction === "output"
    ? device.createRecvTransport(transportOptions)
    : device.createSendTransport(transportOptions);

  transport.on("connect", async ({ dtlsParameters }, resolve, reject) => {
    const result = await wrapper.mutation.connectTransport(transport.id, simplerDirection, dtlsParameters);

    if("error" in result) {
      console.error(result.error); // eslint-disable-line no-console
      reject();
    } else {
      resolve();
    }
  });

  if(direction === "input") {
    transport.on("produce", async ({ kind, rtpParameters, appData }, resolve, reject) => {
      const result = await wrapper.mutation.sendTrack(
        transportOptions.id,
        kind,
        rtpParameters,
        device.rtpCapabilities,
        false,
        appData,
        simplerDirection as "send"
      );

      if("error" in result) {
        console.error(result.error); // eslint-disable-line no-console
        reject();
      } else {
        resolve(result);
      }
    });

    await transport.produce({
      track: track as MediaStreamTrack,
      appData: { mediaTag: "cam-audio" }
    });
  } else {
    const { consumerParametersArr } = await wrapper.query.getConsumersParameters(device.rtpCapabilities);

    const consumers = await Promise.all(consumerParametersArr.map(makeConsumer(transport)));
    const unsubNps = wrapper.subscribe.newPeerSpeaker(async (peer) => {
      consumers.push(await makeConsumer(transport)(peer));
    });

    const unsubCc = wrapper.subscribe.closeConsumer(({ producerId }) => {
      const found = consumers.filter(it => it.consumer.producerId === producerId);

      if(found[0]) consumers.splice(consumers.indexOf(found[0]), 1);
    });

    const unsubYlr = connection.addListener("you_left_room", () => {
      unsubYlr();
      unsubNps();
      unsubCc();
    });

    const giveTrack = track as ConsumerPlayer;

    consumers.forEach(({ user, consumer }) => giveTrack(consumer.track, user));
  }
};
