import React from "react";
import { Story } from "@storybook/react";

import { MultipleUsers, AvatarProps } from "../../ui/UserAvatar/MultipleUsers";

import src from "../../img/avatar.png";

export default {
  title: "UserAvatar/MultipleUsers",
  component: MultipleUsers,
};

export const Default: Story<AvatarProps> = ({ ...props }) => (
  <div className={`bg-primary-800 p-2 rounded-sm`}>
    <MultipleUsers {...props} srcArray={[src, src, src]} />
  </div>
);

Default.bind({});
