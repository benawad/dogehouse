import { audioWrap, http, raw, wrap, Wrapper } from "@dogehouse/kebab";
import { connect as mediasoupConnect } from "@dogehouse/kebab/lib/audio/mediasoup-client";
import { Device } from "mediasoup-client";
import { createWorker, Worker } from "mediasoup-client-aiortc";
import path from "path";

async function makeMicTrack(
  worker: Worker,
  filepath = `../test-sounds/2sec.mp3`
) {
  const stream = await worker.getUserMedia({
    audio: {
      source: "file",
      file: path.join(__dirname, filepath),
    },
  });
  const audio = stream.getAudioTracks()[0];
  return audio as MediaStreamTrack;
}

let worker: Worker;
let device: Device;

export async function startAudio(wrapper: Wrapper) {
  worker = await createWorker({
    logLevel: "warn",
  });

  device = new Device({ handlerFactory: worker.createHandlerFactory() });

  wrapAudio(wrapper);
}

export async function wrapAudio(wrapper: Wrapper) {
  const audioWrapper = audioWrap(wrapper.connection);

  console.log("sub");
  const unsubYjap = audioWrapper.subscribe.youJoinedAsPeer(
    async ({ routerRtpCapabilities, recvTransportOptions }) => {
      unsubYjap();
      console.log("Yjap");
      await mediasoupConnect(
        wrapper.connection,
        routerRtpCapabilities,
        "output",
        recvTransportOptions,
        () => {}
      )(device);

      wrapper.connection.send("ask_to_speak", {});
      const unsubYbs = audioWrapper.subscribe.youBecameSpeaker(
        async ({ sendTransportOptions }) => {
          unsubYbs();
          console.log("Ybs");
          // OrouterRtpCapabilities = routerRtpCapabilities;
          // OsendTransportOptions = sendTransportOptions;
          let track = await makeMicTrack(worker, "../test-sounds/me.mp3");
          await mediasoupConnect(
            wrapper.connection,
            routerRtpCapabilities,
            "input",
            sendTransportOptions,
            track
          )(device);
        }
      );
    }
  );
}

const test = async () => {
  const bot = http.wrap(http.create({ baseUrl: "http://localhost:4001" }));
  const { accessToken, refreshToken } = await bot.testUser("user1");
  const conn = await raw.connect(accessToken, refreshToken, {
    url: "http://localhost:4001/socket",
    logger: (direction, opcode) => {
      if (opcode !== "ping") {
        console.log(direction, opcode);
      }
    },
  });
  const wrapper = wrap(conn);
  await startAudio(wrapper);
  await wrapper.query.joinRoomAndGetInfo(
    "d34c120e-3b76-49d7-b4a9-50be27f9e9af"
  );
};

test();
