import React from "react";
import { Story } from "@storybook/react";

import { SettingsIcon, SettingsIconProps } from "../ui/SettingsIcon";
import { SmSolidUser, SmSolidCaretRight, SmOutlineGlobe } from "../icons";

export default {
  title: "SettingsIcon",
  component: SettingsIcon,
};

export const Default: Story<SettingsIconProps> = ({ ...props }) => {
  return (
    <SettingsIcon
      {...props}
      icon={props.icon || <SmSolidUser className="text-primary-100" />}
      label={props.label || "profile"}
    />
  );
};

export const WithTrailingIcon: Story<SettingsIconProps> = ({ ...props }) => {
  return (
    <SettingsIcon
      {...props}
      icon={props.icon || <SmOutlineGlobe className="text-primary-100" />}
      label={props.label || "Language"}
      trailingIcon={props.trailingIcon || <SmSolidCaretRight className="text-primary-100" />}
    />
  );
};

Default.bind({});
WithTrailingIcon.bind({});
