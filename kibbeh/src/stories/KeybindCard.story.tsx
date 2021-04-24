import React from "react";
import { Story } from "@storybook/react";
import { KeybindCard, KeybindCardProps } from "../ui/KeybindCard";

export default {
  title: "KeybindCard",
  component: KeybindCard,
};

export const ToggleMuteKeybind: Story<KeybindCardProps> = ({
  command = "toggle mute",
  modifier = "ctrl",
  primaryKey = "m",
}) => {
  return (
    <div className="w-1/2 mx-auto">
      <KeybindCard
        command={command}
        modifier={modifier}
        primaryKey={primaryKey}
      />
    </div>
  );
};

ToggleMuteKeybind.bind({});

export const PushToTalkKeybind: Story<KeybindCardProps> = ({
  command = "push-to-talk",
  modifier = "ctrl",
  primaryKey = "1",
}) => {
  return (
    <div className="w-1/2 mx-auto">
      <KeybindCard
        command={command}
        modifier={modifier}
        primaryKey={primaryKey}
      />
    </div>
  );
};

PushToTalkKeybind.bind({});
