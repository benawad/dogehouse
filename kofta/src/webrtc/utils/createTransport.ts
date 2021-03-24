import { TransportOptions } from "mediasoup-client/lib/types";
import { wsend } from "../../createWebsocket";
import { useVoiceStore } from "../stores/useVoiceStore";
import { useWsHandlerStore } from "../stores/useWsHandlerStore";

export async function createTransport(
  _roomId: string,
  direction: "recv" | "send",
  transportOptions: TransportOptions
) {
  console.log(`create ${direction} transport`);
  const { device, set } = useVoiceStore.getState();

  // ask the server to create a server-side transport object and send
  // us back the info we need to create a client-side transport
  console.log("transport options", transportOptions);
  let transport =
    direction === "recv"
      ? await device!.createRecvTransport(transportOptions)
      : await device!.createSendTransport(transportOptions);

  // mediasoup-client will emit a connect event when media needs to
  // start flowing for the first time. send dtlsParameters to the
  // server, then call callback() on success or errback() on failure.
  transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
    useWsHandlerStore
      .getState()
      .addWsListenerOnce(`@connect-transport-${direction}-done`, (d) => {
        if (d.error) {
          console.log(`connect-transport ${direction} failed`, d.error);
          if (d.error.includes("already called")) {
            callback();
          } else {
            errback();
          }
        } else {
          console.log(`connect-transport ${direction} success`);
          callback();
        }
      });
    wsend({
      op: "@connect-transport",
      d: { transportId: transportOptions.id, dtlsParameters, direction },
    });
  });

  if (direction === "send") {
    // sending transports will emit a produce event when a new track
    // needs to be set up to start sending. the producer's appData is
    // passed as a parameter
    transport.on(
      "produce",
      async ({ kind, rtpParameters, appData }, callback, errback) => {
        console.log("transport produce event", appData.mediaTag);
        // we may want to start out paused (if the checkboxes in the ui
        // aren't checked, for each media type. not very clean code, here
        // but, you know, this isn't a real application.)
        let paused = false;
        // if (appData.mediaTag === "cam-video") {
        //   paused = getCamPausedState();
        // } else if (appData.mediaTag === "cam-audio") {
        //   paused = getMicPausedState();
        // }
        // tell the server what it needs to know from us in order to set
        // up a server-side producer object, and get back a
        // producer.id. call callback() on success or errback() on
        // failure.
        useWsHandlerStore
          .getState()
          .addWsListenerOnce(`@send-track-${direction}-done`, (d) => {
            if (d.error) {
              console.log(`send-track ${direction} failed`, d.error);
              errback();
            } else {
              console.log(`send-track-transport ${direction} success`);
              callback({ id: d.id });
            }
          });
        wsend({
          op: "@send-track",
          d: {
            transportId: transportOptions.id,
            kind,
            rtpParameters,
            rtpCapabilities: device!.rtpCapabilities,
            paused,
            appData,
            direction,
          },
        });
      }
    );
  }

  // for this simple demo, any time a transport transitions to closed,
  // failed, or disconnected, leave the room and reset
  //
  transport.on("connectionstatechange", async (state) => {
    console.log(
      `${direction} transport ${transport.id} connectionstatechange ${state}`
    );
  });

  if (direction === "recv") {
    set({ recvTransport: transport });
  } else {
    set({ sendTransport: transport });
  }
}
