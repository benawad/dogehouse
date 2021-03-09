import React from "react";
import { Story } from "@storybook/react";
import {
  NotificationElement,
  NotificationElementProps,
} from "../ui/NotificationElement";
import { Button } from "../ui/Button";

export default {
  title: "NotificationElement",
};

const TheNotificationElement: Story<NotificationElementProps> = ({
  ...props
}) => {
  return (
    <NotificationElement
      {...props}
      actionButton={
        <Button size="small" color="primary">
          Join room
        </Button>
      }
    />
  );
};

export const Main = TheNotificationElement.bind({});
