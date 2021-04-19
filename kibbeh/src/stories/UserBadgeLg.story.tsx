import React from "react";
import { Meta, Story } from "@storybook/react";
import { UserBadgeLg, UserBadgeLgProps } from "../ui/UserBadgeLg";

const Template: Story<UserBadgeLgProps> = ({ icon, label }) => (
  <UserBadgeLg icon={icon}>{label}</UserBadgeLg>
);

export default {
  title: "UserBadgeLg",
  component: UserBadgeLg,
  args: {
    label: "DogeHouse User",
  },
} as Meta;

export const Primary = Template.bind({});
