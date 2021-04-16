import React from "react";
import { Story } from "@storybook/react";
import profileCover from "./img/profile-cover.png";

import {
  ProfileHeaderWrapper,
  ProfileHeaderWrapperProps,
} from "../ui/ProfileHeaderWrapper";

export default {
  title: "ProfileHeaderWrapper",
  component: ProfileHeaderWrapper,
};

const ProfileHeaderChildren = () => (
  <div className="text-accent">Profile header content</div>
);

ProfileHeaderWrapper.defaultProps = {
  coverUrl: profileCover,
  children: <ProfileHeaderChildren />,
};

export const Main: Story<ProfileHeaderWrapperProps> = ({ ...props }) => (
  <ProfileHeaderWrapper {...props} />
);
