import React from "react";
import { Story } from "@storybook/react";

import {
  BaseSettingsItem,
  BaseSettingsItemProps,
} from "../ui/BaseSettingsItem";

export default {
  title: "BaseSettingsItem",
  component: BaseSettingsItem,
};

BaseSettingsItem.defaultProps = {
  children: <></>,
};

export const Main: Story<BaseSettingsItemProps> = ({ ...props }) => (
  <BaseSettingsItem {...props} />
);
