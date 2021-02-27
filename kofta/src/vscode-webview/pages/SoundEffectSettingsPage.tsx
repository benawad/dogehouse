import React from "react";
import { Backbar } from "../components/Backbar";
import { SoundEffectSettings } from "../components/SoundEffectSettings";
import { Wrapper } from "../components/Wrapper";

export const SoundEffectSettingsPage: React.FC = () => {
  return (
    <Wrapper>
      <Backbar actuallyGoBack />
      <SoundEffectSettings />
    </Wrapper>
  );
};
