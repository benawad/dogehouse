import React from "react";

import { Story } from "@storybook/react";
import {
  SearchHeader,
  SearchHeaderProps,
} from "../../ui/mobile/MobileHeader/SearchHeader";

export default {
  title: "MobileHeader/SearchHeader",
  component: SearchHeader,
};

const TheSearchHeader: Story<SearchHeaderProps> = ({
  onBackClick = () => null,
  onSearchChange = () => null,
  searchPlaceholder = "Search",
  searchLoading = false,
}) => (
  <div className="flex" style={{ width: 420 }}>
    <SearchHeader
      onBackClick={onBackClick}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder}
      searchLoading={searchLoading}
    />
  </div>
);

export const Main = TheSearchHeader.bind({});
