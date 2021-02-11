import { useAudioTracks } from "../stores/useAudioTracks";
import { useConsumerStore } from "../stores/useConsumerStore";
import { useVoiceStore } from "../stores/useVoiceStore";

export const consumeAudio = async (consumerParameters: any, peerId: string) => {
  const { recvTransport } = useVoiceStore.getState();
  if (!recvTransport) {
    console.log("skipping consumeAudio because recvTransport is null");
    return false;
  }
  const consumer = await recvTransport.consume({
    ...consumerParameters,
    appData: {
      peerId,
      producerId: consumerParameters.producerId,
      mediaTag: "cam-audio",
    },
  });
  useConsumerStore.getState().add(consumer);
  // console.log("created new consumer", consumer.id);
  const fn = (state: string) => {
    if (state === "connecting") {
      return;
    }
    if (state === "connected") {
      useAudioTracks.getState().add(consumer.track);
      recvTransport.removeListener("connectionstatechange", fn);
    }
  };
  if (recvTransport.connectionState !== "connected") {
    recvTransport.on("connectionstatechange", fn);
  } else {
    useAudioTracks.getState().add(consumer.track);
  }

  return true;
};
