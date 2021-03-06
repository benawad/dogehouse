import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { currentRoomAtom } from "../../vscode-webview/atoms";
import { useConsumerStore } from "../stores/useConsumerStore";

function download(url: string, name = "recording.mp4") {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.download = name;

  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(url);
    link.remove();
  }, 100);
}

export const useRecorder = () => {
  const { consumerMap } = useConsumerStore();
  const [recorder, setRecorder] = useState<MediaRecorder | undefined>(
    undefined
  );
  const [currentRoom] = useAtom(currentRoomAtom);

  const endRecording = async () => {
    if (recorder) {
      const recordingData = await new Promise<Blob>((res) => {
        recorder.ondataavailable = (e) => res(e.data);
        recorder.stop();
      });
      const result = new Blob([recordingData], {
        type: "audio/ogg; codecs=opus",
      });
      const audioURL = URL.createObjectURL(result);
      download(audioURL);
      setRecorder(undefined);
    }
  };
  
  useEffect(() => {
    if (recorder) {
      const tracks = Object.values(consumerMap).map(
        (consumer) => consumer.consumer.track
      );
      const newTracksIds = tracks.map((track) => track.id);
      const existingTracks = recorder.stream.getTracks();
      const existingTrackIds = existingTracks.map((track) => track.id);
      existingTracks.forEach((track) => {
        if (!newTracksIds.includes(track.id)) {
          recorder.stream.removeTrack(track);
        }
      });
      tracks.forEach((track) => {
        if (!existingTrackIds.includes(track.id)) {
          recorder.stream.addTrack(track);
        }
      });
    }
  });


  useEffect(
    () => () => {
      endRecording();
    },
    [recorder]
  );

  return {
    isRecording: !!recorder,
    toggle() {
      if (recorder) {
        setRecorder(undefined);
      } else {
        const mediaRecorder = new MediaRecorder(
          new MediaStream(
            Object.values(consumerMap).map(
              (consumer) => consumer.consumer.track
            )
          )
        );
        mediaRecorder.start();
        setRecorder(mediaRecorder);
      }
    },
  };
};
