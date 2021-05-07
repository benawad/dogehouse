import { Router } from "mediasoup/lib/Router";
import { config } from "../config";
// import { FFmpeg } from "./ffmpeg";
import { getPort } from "./port";

export const createRecordingTransport = async (router: Router) => {
  const listenIp = config.mediasoup.webRtcTransport.listenIps[0];
  const rtpTransport = await router.createPlainTransport({
    listenIp,
  });

  const port = await getPort();

  await rtpTransport.connect({
    ip: listenIp.announcedIp || "127.0.0.1",
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
  return { rtpTransport, port, ip: listenIp.announcedIp || "127.0.0.1" };
};
