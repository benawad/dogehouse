import React from "react";
import { Story } from "@storybook/react";
import { BubbleText, BubbleTextProps } from "../ui/BubbleText";
import { toBoolean } from "./utils/toBoolean";

export default {
  title: "BubbleText",
};

const TheBubbleText: Story<BubbleTextProps> = ({ live = false, children }) => {
  return (
    <BubbleText live={live}>
      {children || live ? Math.round(Math.random() * 1000) : "12:30 PM"}
    </BubbleText>
  );
};

export const Main = TheBubbleText.bind({});

Main.argTypes = {
  live: toBoolean(),
};
