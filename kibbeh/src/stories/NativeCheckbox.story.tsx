import React from "react";
import { Meta, Story } from "@storybook/react";
import { NativeCheckBox, ToggleContext } from "../ui/NativeCheckbox";

const Template: Story<ToggleContext> = (args, { toggle }) => (
  <div>
    <NativeCheckBox toggle={toggle} {...args} />
    <NativeCheckBox
      {...args}
      title="Whispers"
      description="Allow room users to whisper you"
    />
  </div>
);

export default {
  title: "NativeCheckbox",
  component: NativeCheckBox,
} as Meta;

export const Main = Template.bind({});

Main.args = {
  title: "Bot Messages",
  description: "Show messages by Bots",
};
