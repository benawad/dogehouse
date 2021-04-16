import React from "react";

import { Story } from "@storybook/react";
import {
  ProfileHeader,
  ProfileHeaderProps,
} from "../../ui/mobile/MobileHeader/ProfileHeader";

import src from "../../img/avatar.png";

export default {
  title: "MobileHeader/ProfileHeader",
  component: ProfileHeader,
};

const TheProfileHeader: Story<ProfileHeaderProps> = ({
  avatar = src,
  onAnnouncementsClick = () => null,
  onMessagesClick = () => null,
  onSearchClick = () => null,
}) => (
  <div className="flex" style={{ width: 420 }}>
    <ProfileHeader
      avatar={avatar}
      onAnnouncementsClick={onAnnouncementsClick}
      onMessagesClick={onMessagesClick}
      onSearchClick={onSearchClick}
    />
  </div>
);

export const Main = TheProfileHeader.bind({});
