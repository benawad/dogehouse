import React from "react";
import { useSoundEffectStore } from "../modules/sound-effects/useSoundEffectStore";
import { Checkbox } from "./Checkbox";

interface ChatSettingsProps {}

export const ChatSettings: React.FC<ChatSettingsProps> = () => {
  const [soundEffectSettings, setSetting] = useSoundEffectStore((x) => [
    x.settings,
    x.setSetting,
  ]);

  return (
    <>
      <h1 className={`py-8 text-4xl`}>Chat Settings</h1>

      <Checkbox
        value={soundEffectSettings.roomChatMention}
        label={"Play a sound when somebody mentions you in chat"}
        onChange={() =>
          setSetting("roomChatMention", !soundEffectSettings.roomChatMention)
        }
      />
    </>
  );
};
