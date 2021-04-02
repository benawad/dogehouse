import React from "react";
import { Story } from "@storybook/react";

import { GistPopup, GistPopupProps } from "../ui/GistPopup";

export const Main: Story<GistPopupProps> = ({ id }) => (
  <GistPopup id={id || "692a24e7a4251ce3ec3b6a2aa1791537"} />
);

export default {
  title: "GistPopup",
  component: Main,
};

Main.bind({});
