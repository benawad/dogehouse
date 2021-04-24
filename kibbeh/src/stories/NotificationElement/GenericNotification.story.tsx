import React from "react";
import { Story } from "@storybook/react";
import {
  GenericNotification,
  GenericNotificationProps,
} from "../../ui/NotificationElement/GenericNotification";

export default {
  title: "Notification/GenericNotification",
  component: GenericNotification,
};

export const Default: Story<GenericNotificationProps> = ({ ...props }) => {
  return <GenericNotification {...props} />;
};

Default.bind({});
