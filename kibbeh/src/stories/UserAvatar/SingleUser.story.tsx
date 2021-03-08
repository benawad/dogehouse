import React from "react";
import { Story } from "@storybook/react";

import { SingleUser, AvatarProps } from "../../ui/UserAvatar/SingleUser";

const src = require("../../img/avatar.png");

export default {
  title: "UserAvatar/SingleUser",
  component: SingleUser,
};

export const Default: Story<AvatarProps> = ({ ...props }) => (
  <SingleUser {...props} src={src} />
);

export const Online: Story<AvatarProps> = ({ ...props }) => (
  <SingleUser {...props} src={src} isOnline />
);

Default.bind({});
Online.bind({});
