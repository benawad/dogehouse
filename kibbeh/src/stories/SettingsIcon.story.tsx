import React from "react";
import { Story } from "@storybook/react";

import { SettingsIcon, SettingsIconProps } from "../ui/SettingsIcon";
import { SolidUser, SolidCaretRight, OutlineGlobe } from "../icons";

export default {
  title: "SettingsIcon",
  component: SettingsIcon,
};

export const Default: Story<SettingsIconProps> = ({ ...props }) => {
  return (
    <SettingsIcon
      {...props}
      icon={props.icon || <SolidUser className="text-primary-100" />}
      label={props.label || "profile"}
    />
  );
};

export const WithTrailingIcon: Story<SettingsIconProps> = ({ ...props }) => {
  return (
    <SettingsIcon
      {...props}
      icon={props.icon || <OutlineGlobe className="text-primary-100" />}
      label={props.label || "Language"}
      trailingIcon={
        props.trailingIcon || <SolidCaretRight className="text-primary-100" />
      }
    />
  );
};

Default.bind({});
WithTrailingIcon.bind({});
