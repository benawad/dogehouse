import React from "react";

import SearchIcon from "../icons/SmSolidSearch";

export interface SearchHistoryProps {
  onClickToDeleteSearchHistory: React.MouseEventHandler<HTMLSpanElement>
  searchText: string
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onClickToDeleteSearchHistory, searchText }) => {
  return (
    <div className={"flex flex-row bg-primary-900"}>
      <div className={"flex flex-1 items-center"}>
        <SearchIcon className={"mr-2 stroke-current hover:text-primary-100 text-primary-300 cursor-pointer"} />
        <span className={"text-primary-300 hover:text-primary-100 cursor-pointer"}>{searchText}</span>
      </div>
      <span onClick={onClickToDeleteSearchHistory} className={"text-accent underline cursor-pointer"}>Delete</span>
    </div>
  );
};

export default SearchHistory;
