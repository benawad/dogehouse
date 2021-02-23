import { useConsumerStore } from "@dogehouse/feta/webrtc/stores/useConsumerStore";
import { useVoiceStore } from "@dogehouse/feta/webrtc/stores/useVoiceStore";

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
  useConsumerStore.getState().add(consumer, peerId);

  return true;
};
