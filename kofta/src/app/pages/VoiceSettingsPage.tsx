import React from "react";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { VoiceSettings } from "../components/VoiceSettings";
import { Wrapper } from "../components/Wrapper";

interface VoiceSettingsPageProps {}

export const VoiceSettingsPage: React.FC<VoiceSettingsPageProps> = () => {
  return (
    <Wrapper>
      <Backbar actuallyGoBack />
      <BodyWrapper>
        <VoiceSettings />
      </BodyWrapper>
    </Wrapper>
  );
};
