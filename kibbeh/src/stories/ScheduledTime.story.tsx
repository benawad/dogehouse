import React from "react";
import { Story } from "@storybook/react";
import { ScheduledTime } from "../ui/ScheduledTime";

export default {
  title: "ScheduledTime",
};

const TheScheduledTime: Story = ({ children }) => {
  return <ScheduledTime>{children || `12:30 PM`}</ScheduledTime>;
};

export const Main = TheScheduledTime.bind({});
