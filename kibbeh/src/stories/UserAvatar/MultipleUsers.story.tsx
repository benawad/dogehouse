import React from "react";
import { Story } from "@storybook/react";

import { MultipleUsers, AvatarProps } from "../../ui/UserAvatar/MultipleUsers";

import src from "../../img/avatar.png";

export default {
  title: "UserAvatar/MultipleUsers",
  component: MultipleUsers,
};

export const Default: Story<AvatarProps> = ({ ...props }) => (
  <MultipleUsers {...props} srcArray={[src, src, src]} />
);

Default.bind({});
