import React from "react";
import { Story } from "@storybook/react";
import profileCover from "./img/profile-cover.png";

import {
  ChangeAvatarCard,
  ChangeAvatarCardProps,
} from "../ui/ChangeAvatarCard";
import { sampleBaseUser } from "./data/BaseUser";

export default {
  title: "ChangeAvatarCard",
  component: ChangeAvatarCard,
};

export const Main: Story<ChangeAvatarCardProps> = ({ ...props }) => (
  <ChangeAvatarCard {...props} user={sampleBaseUser} />
);
