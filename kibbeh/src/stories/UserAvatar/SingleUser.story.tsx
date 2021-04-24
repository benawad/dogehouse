import React from "react";
import { Story } from "@storybook/react";

import { SingleUser, AvatarProps } from "../../ui/UserAvatar/SingleUser";

import src from "../../img/avatar.png";

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

export const Muted: Story<AvatarProps> = ({ ...props }) => (
  <SingleUser {...props} src={src} muted />
);

export const Deafened: Story<AvatarProps> = ({ ...props }) => (
  <SingleUser {...props} src={src} deafened />
);

Default.bind({});
Online.bind({});
