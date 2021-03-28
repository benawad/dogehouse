import { Connection } from "@dogehouse/kebab/lib/raw";
import { useVoiceStore } from "../stores/useVoiceStore";
import { consumeAudio } from "./consumeAudio";

export const receiveVoice = (conn: Connection, flushQueue: () => void) => {
  conn.once<any>("@get-recv-tracks-done", async ({ consumerParametersArr }) => {
    try {
      for (const { peerId, consumerParameters } of consumerParametersArr) {
        if (!(await consumeAudio(consumerParameters, peerId))) {
          break;
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      flushQueue();
    }
  });
  conn.send("@get-recv-tracks", {
    rtpCapabilities: useVoiceStore.getState().device!.rtpCapabilities,
  });
};
