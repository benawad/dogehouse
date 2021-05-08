import { Router } from "mediasoup/lib/Router";
// import { FFmpeg } from "./ffmpeg";
// import { getPort } from "./port";

export const createRecordingTransport = async (router: Router) => {
  const listenIp = process.env.IP_A || "127.0.0.1";
  const rtpTransport = await router.createPlainTransport({
    listenIp,
  });

  const port = 20389;
  // await getPort();

  await rtpTransport.connect({
    ip: listenIp,
    port,
  });

  // new FFmpeg(port, {
  //   codecs: [
  //     router.rtpCapabilities.codecs!.find(
  //       (codec) => codec.kind === "audio"
  //     ) as any,
  //   ],
  // });
  console.log(listenIp);
  return { rtpTransport, port, ip: listenIp };
};
