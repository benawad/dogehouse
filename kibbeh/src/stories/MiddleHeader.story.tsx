import React from "react";
import { Story } from "@storybook/react";
import { MiddleHeaderProps, MiddleHeader } from "../ui/header/MiddleHeader";

export default {
  title: "MiddleHeader",
  component: MiddleHeader,
};

export const Main: Story<MiddleHeaderProps> = ({ ...props }) => (
  <MiddleHeader {...props} />
);
