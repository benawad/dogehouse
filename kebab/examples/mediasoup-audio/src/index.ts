import { wrap, raw } from "@dogehouse/kebab";
import { connect as mediasoupConnect } from "@dogehouse/kebab/lib/audio/mediasoup-client";
import { Device } from "mediasoup-client";

const main = async () => {
  const wrapper = wrap(await raw.connect(process.env.DOGEHOUSE_TOKEN!, process.env.DOGEHOUSE_REFRESH_TOKEN!, {}));
  const { rooms } = await wrapper.query.getTopPublicRooms()
  const theRoom = rooms[0];
  const device = new Device();

  const currentRole = document.querySelector(".current-role")!;

  const makeMicTrack = async () => {
    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });

      return mic.getAudioTracks()[0];
    } catch {
      const cantUseMic = document.createElement("span");

      cantUseMic.className = "cant-use-mic";
      cantUseMic.textContent = "- can't use mic";
      currentRole.appendChild(cantUseMic);
    }
  };

  const playOutput = (track: MediaStreamTrack) => {
    const audio = new Audio();

    audio.srcObject = new MediaStream([track]);
    audio.play();
  };

  const unsubYjap = wrapper.connection.addListener("you-joined-as-peer", async (data: any) => {
    unsubYjap();

    await mediasoupConnect(
      wrapper.connection,
      data.routerRtpCapabilities,
      "output",
      data.recvTransportOptions,
      playOutput
    )(device);
    currentRole.textContent = "Listener";

    const button = document.createElement("button");

    button.textContent = "Request to speak";
    button.addEventListener("click", () => wrapper.connection.send("ask_to_speak", {}));
    currentRole.appendChild(button);

    const unsubYanas = wrapper.connection.addListener("you-are-now-a-speaker", async (data: any) => {
      unsubYanas();

      await mediasoupConnect(
        wrapper.connection,
        data.routerRtpCapabilities,
        "input",
        data.sendTransportOptions,
        await makeMicTrack()
      )(device);

      currentRole.removeChild(button);
    });

    const unsubYlr = wrapper.connection.addListener("you_left_room", () => {
      unsubYlr();
      unsubYanas();
    });
  });

  const unsubYjas = wrapper.connection.addListener("you-joined-as-speaker", async (data: any) => {
    unsubYjas();

    await mediasoupConnect(
      wrapper.connection,
      data.routerRtpCapabilities,
      "output",
      data.recvTransportOptions,
      playOutput
    )(device);

    await mediasoupConnect(
      wrapper.connection,
      data.routerRtpCapabilities,
      "input",
      data.sendTransportOptions,
      await makeMicTrack()
    )(device);
  });

  const extraInfo = await wrapper.query.joinRoomAndGetInfo(theRoom.id);
  document.querySelector(".current-room")!.textContent = theRoom.name;
}

main();
