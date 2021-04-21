import { Story } from "@storybook/react";
import React from "react";
import { RoomCardHeadingProps } from "../ui/RoomCardHeading";
import { sampleBaseUser } from "./data/BaseUser";
import { UserWideButton } from '../ui/UserWideButton';

export default {
  title: "UserWideButton",
};

export const Main: Story<RoomCardHeadingProps> = () => {
  return <UserWideButton user={sampleBaseUser} />;
};