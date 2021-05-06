import { Story } from "@storybook/react";
import React from "react";
import { RoomCardHeadingProps } from "../ui/RoomCardHeading";
import { VerticalUserInfo } from "../ui/VerticalUserInfo";
import { sampleBaseUser } from "./data/BaseUser";

export default {
  title: "VerticalUserInfo",
};

export const Main: Story<RoomCardHeadingProps> = () => {
  return <VerticalUserInfo user={sampleBaseUser} />;
};
