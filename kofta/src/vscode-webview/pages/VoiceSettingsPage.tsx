import React from "react";
import { Backbar } from "../components/Backbar";
import { VoiceSettings } from "../components/VoiceSettings";
import { Wrapper } from "../components/Wrapper";

interface VoiceSettingsPageProps {}

export const VoiceSettingsPage: React.FC<VoiceSettingsPageProps> = () => {
  return (
    <Wrapper>
      <Backbar actuallyGoBack />
      <VoiceSettings />
    </Wrapper>
  );
};
