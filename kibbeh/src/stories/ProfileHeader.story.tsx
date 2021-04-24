import React from "react";
import { Meta, Story } from "@storybook/react";
import { ProfileHeader, ProfileHeaderProps } from "../ui/ProfileHeader";
import { Main as UserBadge } from "./UserBadge.story";

const Template: Story<ProfileHeaderProps> = ({ ...props }) => (
  <ProfileHeader {...props} />
);

export default {
  title: "ProfileHeader",
  component: ProfileHeader,
} as Meta;

export const Main = Template.bind({});
Main.args = {
  displayName: "Glen Brenner",
  username: "@glen_brenner",
  children: <UserBadge />,
};
