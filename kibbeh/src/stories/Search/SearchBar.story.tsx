import React from "react";
import { Story } from "@storybook/react";
import { SearchBar, SearchBarProps } from "../../ui/Search/SearchBar";
import { toStr } from "../utils/toStr";

export default {
  title: "Search/SearchBar",
  argTypes: {
    onChange: { action: "changed" },
  },
};

const TheSearchBar: Story<SearchBarProps> = ({ placeholder, ...props }) => {
  return (
    <SearchBar
      placeholder={placeholder || "Search for rooms, users or categories"}
      {...props}
    />
  );
};

export const Main = TheSearchBar.bind({});

Main.argTypes = {
  value: toStr(),
  placeholder: toStr(),
};
