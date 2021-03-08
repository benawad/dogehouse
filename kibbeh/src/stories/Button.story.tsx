import React from "react";
import { Story } from "@storybook/react";
import { Button, ButtonProps } from "../ui/Button";
import { toEnum } from "./utils/toEnum";
import { toBoolean } from "./utils/toBoolean";

export default {
  title: "Button",
  argTypes: { onClick: { action: "clicked" } },
};

const TheButton: Story<ButtonProps> = ({ children, ...props }) => {
  return <Button {...props}>{children || `New room`}</Button>;
};

export const Main = TheButton.bind({});

Main.argTypes = {
  color: toEnum(["primary", "secondary"]),
  size: toEnum(["big", "small"]),
  disabled: toBoolean(),
  loading: toBoolean(),
};
