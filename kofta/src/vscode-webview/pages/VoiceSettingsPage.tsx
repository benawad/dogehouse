import React from "react";
import { Backbar } from "../components/Backbar";
import { VoiceSettings } from "../components/VoiceSettings";
import { Wrapper } from "../components/Wrapper";

interface VoiceSettingsPageProps {}

export const VoiceSettingsPage: React.FC<VoiceSettingsPageProps> = () => {
  return (
    <Wrapper style={{ marginBottom: "auto" }}>
      <Backbar />
      <div style={{ padding: "0 var(--container-paddding)" }}>
        <VoiceSettings />
      </div>
    </Wrapper>
  );
};
