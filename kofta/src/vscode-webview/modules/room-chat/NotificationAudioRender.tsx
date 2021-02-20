import React, { useEffect, useState } from "react";
import { useRoomChatSettingsStore } from "../../../webrtc/stores/useRoomChatSettingsStore";
import { useRoomChatStore } from "./useRoomChatStore";

interface NotificationAudioRenderProps {}
export const NotificationAudioRender: React.FC<NotificationAudioRenderProps> = () => {
  // Play sound when iAmMentioned
  const { iAmMentioned } = useRoomChatStore();
  const { shouldPlayChatSound } = useRoomChatSettingsStore();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(new Audio());

  useEffect(() => {
    if (iAmMentioned && shouldPlayChatSound) {
      try {
        audio?.play();
      } catch (err) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iAmMentioned]);

  return <audio ref={(ref) => setAudio(ref)} src="/notif.ogg" />;
};
