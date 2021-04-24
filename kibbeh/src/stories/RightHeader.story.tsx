import React from "react";
import { Story } from "@storybook/react";

import RightHeader, { RightHeaderProps } from "../ui/header/RightHeader";

export default {
  title: "RightHeader",
  component: RightHeader,
};

export const Main: Story<RightHeaderProps> = ({ ...props }) => (
  <RightHeader {...props} />
);
