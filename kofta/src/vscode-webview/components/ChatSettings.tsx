import React from "react";
import { useRoomChatSettingsStore } from "../../webrtc/stores/useRoomChatSettingsStore";
import { Checkbox } from "./Checkbox";

interface ChatSettingsProps {}

export const ChatSettings: React.FC<ChatSettingsProps> = () => {
  const {
    shouldPlayChatSound,
    setShouldPlayChatSound,
  } = useRoomChatSettingsStore();

  return (
    <>
      <h1 className={`py-8 text-4xl`}>Chat Settings</h1>

      <Checkbox
        value={shouldPlayChatSound}
        label={"Play a sound when somebody mentions you in chat"}
        onChange={() => setShouldPlayChatSound(!shouldPlayChatSound)}
      />
    </>
  );
};
