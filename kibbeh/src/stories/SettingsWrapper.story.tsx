import React from "react";
import { Story } from "@storybook/react";

import { SettingsWrapper, SettingsWrapperProps } from "../ui/SettingsWrapper";

export default {
  title: "SettingsWrapper",
  component: SettingsWrapper,
};

SettingsWrapper.defaultProps = {
  children: <></>,
};

export const Main: Story<SettingsWrapperProps> = ({ ...props }) => (
  <SettingsWrapper {...props} />
);
