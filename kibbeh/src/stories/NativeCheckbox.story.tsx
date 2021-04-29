import React from "react";
import { Meta, Story } from "@storybook/react";
import {
  NativeCheckbox,
  NativeCheckboxController,
  NativeCheckboxControllerProps,
  NativeCheckboxProps,
} from "../ui/NativeCheckbox";

export default {
  title: "NativeCheckbox",
  component: NativeCheckboxController,
} as Meta;

export const Main: Story<NativeCheckboxControllerProps> = ({ checkboxes }) => {
  return (
    <div style={{ width: 640 }} className="p-4 bg-primary-800">
      <NativeCheckboxController checkboxes={checkboxes} />
    </div>
  );
};

Main.bind({});

Main.args = {
  checkboxes: [
    {
      title: "Whispers",
      subtitle: "Allow room users to whisper you",
    },
    {
      title: "Mentions",
      subtitle: "Allow room users to mention you",
    },
    {
      title: "Bot Messages",
      subtitle: "Show messages by Bots",
    },
  ],
};
