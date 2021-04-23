import { Story } from "@storybook/react";
import React from "react";
import { sampleBaseUser } from "./data/BaseUser";
import { UserWideButton, UserWideButtonInfoProps } from "../ui/UserWideButton";

export default {
  title: "UserWideButton",
  component: UserWideButton,
};

const changeText = (isBlocked: boolean, isFollowing: boolean, text: string) => {
    if(isBlocked){
        return "Unblock";
    } else if (isFollowing){
        return "Follows you"
    } else{
        return "block"
    }
};

export const Main: Story<UserWideButtonInfoProps> = ({ ...props }) => {
    // <div style={{ height:"100px", width: "719px" }}>
      return  <UserWideButton { ...props } userStatus={() => { return changeText(false, false, "Unblock")}} user={sampleBaseUser} />;
    // </div>
};
