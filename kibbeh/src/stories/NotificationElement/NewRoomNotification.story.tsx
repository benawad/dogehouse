import React from "react";
import { Story } from "@storybook/react";

import {
  NewRoomNotification,
  NewRoomNotificationProps,
} from "../../ui/NotificationElement/NewRoomNotification";

export default {
  title: "Notification/NewRoomNotification",
  component: NewRoomNotification,
};

export const Default: Story<NewRoomNotificationProps> = ({ ...props }) => (
  <NewRoomNotification {...props} username={props.username || "johndoe"} />
);

Default.bind({});
