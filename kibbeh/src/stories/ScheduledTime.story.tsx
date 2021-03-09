import React from "react";
import { Story } from "@storybook/react";
import { ScheduledTime } from "../ui/ScheduledTime";
import { toBoolean } from "./utils/toBoolean";

export default {
  title: "ScheduledTime",
};

const TheScheduledTime: Story = ({ active, children }) => {
  return (
    <ScheduledTime active={active}>{children || `12:30 PM`}</ScheduledTime>
  );
};

export const Main = TheScheduledTime.bind({});

Main.argTypes = {
  active: toBoolean(),
};
