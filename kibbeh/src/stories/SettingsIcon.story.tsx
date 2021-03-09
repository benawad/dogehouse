import React from "react";
import { Story } from "@storybook/react";

import { SettingsIcon, SettingsIconProps } from "../ui/SettingsIcon";
import { SmSolidUser, SmForwardArrow, SmOutlineGlobe } from "../icons";

export default {
  title: "SettingsIcon",
  component: SettingsIcon,
};

export const Default: Story<SettingsIconProps> = ({ ...props }) => {
  return (
    <SettingsIcon
      {...props}
      icon={props.icon || <SmSolidUser />}
      label={props.label || "profile"}
    />
  );
};

export const WithTrailingIcon: Story<SettingsIconProps> = ({ ...props }) => {
  return (
    <SettingsIcon
      {...props}
      icon={props.icon || <SmOutlineGlobe />}
      label={props.label || "Language"}
      trailingIcon={props.trailingIcon || <SmForwardArrow />}
    />
  );
};

Default.bind({});
WithTrailingIcon.bind({});
