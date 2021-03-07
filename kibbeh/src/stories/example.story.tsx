import React from "react";
import { Button } from "@storybook/react/demo";

export default {
  title: "example button",
  argTypes: { onClick: { action: "clicked" } },
};
export const ExampleButton = (props: HTMLButtonElement) => {
  return <Button {...props}>example...</Button>;
};
