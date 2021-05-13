import { useAudioStreamStore } from "./stores/useAudioStreamStore";
import { useVoiceStore } from "./stores/useVoiceStore";

export function closeVoiceConnections(_roomId: string | null) {
  const { roomId, mic, nullify } = useVoiceStore.getState();
  useAudioStreamStore.getState().closeAll();
  if (_roomId === null || _roomId === roomId) {
    if (mic) {
      console.log("stopping mic");
      mic.stop();
    }

    console.log("nulling transports");
    nullify();
  }
}
