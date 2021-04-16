import React from "react";
import { Story } from "@storybook/react";
import { SettingsDropdown } from "../ui/SettingsDropdown";

export default {
  title: "SettingsDropdown",
};

const TheSettingsDropdown: Story = () => {
  return (
    <SettingsDropdown
      onActionButtonClicked={() => {}}
      onCloseDropdown={() => {}}
      // @todo
      user={{} as any}
    />
  );
};

export const Main = TheSettingsDropdown.bind({});
