import { Story } from "@storybook/react";
import React from "react";
import { sampleBaseUser } from "./data/BaseUser";
import { UserWideButton, UserWideButtonInfoProps } from "../ui/UserWideButton";

export default {
  title: "UserWideButton",
  component: UserWideButton,
};

export const Main: Story<UserWideButtonInfoProps> = ({ ...props }) => {
  return <UserWideButton {...props} user={sampleBaseUser} />;
};
