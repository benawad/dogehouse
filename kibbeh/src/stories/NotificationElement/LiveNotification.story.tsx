import React from "react";
import { Story } from "@storybook/react";

import {
  LiveNotification,
  LiveNotificationProps,
} from "../../ui/NotificationElement/LiveNotification";

export default {
  title: "Notification/LiveNotification",
  component: LiveNotification,
};

export const Default: Story<LiveNotificationProps> = ({ ...props }) => (
  <LiveNotification {...props} username={props.username || "johndoe"} />
);

Default.bind({});
