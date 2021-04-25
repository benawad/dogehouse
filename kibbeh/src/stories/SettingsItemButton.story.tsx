import React, { ReactNode } from "react";
import { Story } from "@storybook/react";
import {
  SettingsItemButton,
  SettingsItemButtonProps,
} from "../ui/SettingsItemButton";

export default {
  title: "SettingsItemButton",
  component: SettingsItemButton,
};

export const Main: Story<SettingsItemButtonProps> = ({
  text = "This is a one way operation, once you delete your account there is no going back. Please be certain.",
  buttonText = "Delete your account",
  onClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
  },
}) => (
  <SettingsItemButton text={text} buttonText={buttonText} onClick={onClick} />
);

Main.bind({});
