import React from "react";
import { Button, ButtonProps } from "../ui/Button";

export default {
  title: "Button",
  argTypes: { onClick: { action: "clicked" } },
};

export const Primary = (props: ButtonProps) => {
  return <Button {...props}>New room</Button>;
};
