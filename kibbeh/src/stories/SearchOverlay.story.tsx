import React from "react";
import { Story } from "@storybook/react";

import { SearchOverlay, SearchOverlayProps } from "../ui/SearchOverlay";
import { SearchBar } from "../ui/SearchBar";

export default {
  title: "SearchOverlay",
  component: SearchOverlay,
};

export const Main: Story<SearchOverlayProps> = ({ children }) => (
  <SearchOverlay>{children || <SearchBar />}</SearchOverlay>
);

Main.bind({});
