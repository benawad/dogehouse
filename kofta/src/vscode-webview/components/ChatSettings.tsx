import React from "react";
import { tw } from "twind";
import { useRoomChatSettingsStore } from "../../webrtc/stores/useRoomChatSettingsStore";
import { Checkbox } from "./Checkbox";

interface ChatSettingsProps {
  className?: string;
}

export const ChatSettings: React.FC<ChatSettingsProps> = ({ className }) => {
  const {
    shouldPlayChatSound,
    setShouldPlayChatSound,
  } = useRoomChatSettingsStore();

  return (
    <div className={className}>
      <h1 className={tw`py-8 text-4xl`}>Chat Settings</h1>

      <Checkbox
        value={shouldPlayChatSound}
        label={"Play a sound when somebody mentions you in chat"}
        onChange={() => setShouldPlayChatSound(!shouldPlayChatSound)}
      />
    </div>
  );
};
