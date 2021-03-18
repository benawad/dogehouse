import React from "react";
import { Story } from "@storybook/react";

import {
  SearchOverlay,
  SearchOverlayProps,
} from "../../ui/Search/SearchOverlay";
import { SearchBar } from "../../ui/Search/SearchBar";

export default {
  title: "Search/SearchOverlay",
  component: SearchOverlay,
};

export const Main: Story<SearchOverlayProps> = ({ children }) => (
  <SearchOverlay>{children || <SearchBar />}</SearchOverlay>
);

Main.bind({});
