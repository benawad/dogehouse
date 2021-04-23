import { Story } from "@storybook/react";
import React from "react";
import { sampleBaseUser } from "./data/BaseUser";
import { UserWideButton, UserWideButtonInfoProps } from "../ui/UserWideButton";

export default {
  title: "UserWideButton",
  component: UserWideButton,
};

const changeText = (isBlocked: boolean, isFollowing: boolean) => {
  if (isBlocked) {
    return "Unblock";
  } else if (isFollowing) {
    return "Follows you";
  } else {
    return "Block";
  }
};

export const Main: Story<UserWideButtonInfoProps> = ({ ...props }) => {
  return (
    <UserWideButton
      {...props}
      userStatus={() => {
        return changeText(false, true);
      }}
      user={sampleBaseUser}
    />
  );
};
