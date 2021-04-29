import React from "react";
import { Story } from "@storybook/react";
import {
  ChangeAvatarCard,
  ChangeAvatarCardProps,
} from "../ui/ChangeAvatarCard";
import avatar from "../img/avatar.png";

export default {
  title: "ChangeAvatarCard",
  component: ChangeAvatarCard,
};

ChangeAvatarCard.defaultProps = {
  avatarUrl: avatar,
};

export const Main: Story<ChangeAvatarCardProps> = ({ ...props }) => (
  <div className="w-3/5 mx-auto">
    <ChangeAvatarCard {...props} />
  </div>
);
