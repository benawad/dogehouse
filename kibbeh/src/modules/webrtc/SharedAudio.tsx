import React, { useEffect } from "react";
import { useDeafStore } from "../../global-stores/useDeafStore";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { ActiveSpeakerListener } from "./components/ActiveSpeakerListener";
import { useVoiceStore } from "./stores/useVoiceStore";

interface SharedAudioProps {}

export const SharedAudio: React.FC<SharedAudioProps> = ({}) => {
  const { muted } = useMuteStore();
  const { mic } = useVoiceStore();
  const { deafened } = useDeafStore();

  useEffect(() => {
    if (mic) {
      mic.enabled = !muted && !deafened;
    }
  }, [mic, muted, deafened]);
  return <ActiveSpeakerListener />;
};
