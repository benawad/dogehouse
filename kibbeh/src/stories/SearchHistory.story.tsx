import React from "react";
import SearchHistoryComponent, {
  SearchHistoryProps,
} from "../ui/SearchHistory";

export default {
  title: "SearchHistory",
  argTypes: {
    onClickToDeleteSearchHistory: { action: "clicked" },
    searchText: { defaultValue: "javascript" },
  },
};

export const SearchHistory = (props: SearchHistoryProps) => {
  return <SearchHistoryComponent {...props} />;
};
