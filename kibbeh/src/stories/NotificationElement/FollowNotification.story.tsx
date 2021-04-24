import React from "react";
import { Story } from "@storybook/react";

import {
  FollowNotification,
  FollowNotificationProps,
} from "../../ui/NotificationElement/FollowNotification";

import src from "../../img/avatar.png";

export default {
  title: "Notification/FollowNotification",
  component: FollowNotification,
};

export const Default: Story<FollowNotificationProps> = ({ ...props }) => (
  <FollowNotification
    {...props}
    userAvatarSrc={props.userAvatarSrc || src}
    username={props.username || "johndoe"}
  />
);

Default.bind({});
