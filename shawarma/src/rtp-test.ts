// import { createRecordingTransport } from "./recording/createRecordingTransport";
// import { startMediasoup } from "./utils/startMediasoup";
// import { Device } from "mediasoup-client";
// import { createWorker, Worker } from "mediasoup-client-aiortc";
// import { createTransport, transportToOptions } from "./utils/createTransport";
// import path from "path";

// async function makeMicTrack(worker: Worker, filepath = `./me.mp3`) {
//   const stream = await worker.getUserMedia({
//     audio: {
//       source: "file",
//       file: path.join(__dirname, filepath),
//     },
//   });
//   const audio = stream.getAudioTracks()[0];
//   return audio as MediaStreamTrack;
// }

// const main = async () => {
//   const workers = await startMediasoup();
//   const { router } = workers[0];
//   const { ip, port, rtpTransport } = await createRecordingTransport(router);
//   const worker = await createWorker({
//     logLevel: "warn",
//   });

//   const device = new Device({ handlerFactory: worker.createHandlerFactory() });

//   const serverTransport = await createTransport("send", router, "");

//   await device.load({ routerRtpCapabilities: router.rtpCapabilities });
//   const transport = device.createSendTransport(
//     transportToOptions(serverTransport) as any
//   );
//   transport.on("connect", async ({ dtlsParameters }, resolve, _reject) => {
//     await serverTransport.connect({ dtlsParameters });

//     resolve();
//   });

//   transport.on("produce", async ({ rtpParameters }, resolve, _reject) => {
//     const producer = await serverTransport.produce({
//       kind: "audio",
//       rtpParameters,
//       paused: false,
//     });

//     await rtpTransport.consume({
//       rtpCapabilities: device.rtpCapabilities,
//       producerId: producer.id,
//       paused: false,
//     });

//     console.log({ ip, port });

//     resolve(producer);
//   });

//   await transport.produce({
//     track: await makeMicTrack(worker),
//     appData: { mediaTag: "cam-audio" },
//   });
// };

// main();
