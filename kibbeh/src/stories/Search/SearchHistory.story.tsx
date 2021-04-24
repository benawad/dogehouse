import React from "react";
import SearchHistoryComponent, {
  SearchHistoryProps,
} from "../../ui/Search/SearchHistory";

export default {
  title: "Search/SearchHistory",
  argTypes: {
    onClickToDeleteSearchHistory: { action: "clicked" },
    searchText: { defaultValue: "javascript" },
  },
};

export const SearchHistory = (props: SearchHistoryProps) => {
  return <SearchHistoryComponent {...props} />;
};
