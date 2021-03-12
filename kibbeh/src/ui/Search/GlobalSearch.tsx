import React, { ChangeEventHandler, useState } from "react";

import { SearchOverlay } from "./SearchOverlay";
import { SearchBar } from "./SearchBar";
import { RoomSearchResult, UserSearchResult } from "./SearchResult";
import SearchHistory from "./SearchHistory";

export type HistoryItem = {
  id: string;
  term: string;
};

export type UserSearchResult = {
  id: string;
  avatar: string;
  displayName: string;
  username: string;
  isOnline: boolean;
};

export type RoomSearchResult = {
  id: string;
  displayName: string;
  hosts: string[];
  userCount: number;
};

export type SearchResultItem = {
  type: "room" | "user";
  result: UserSearchResult | RoomSearchResult;
};

export interface GlobalSearchProps {
  history: HistoryItem[];
  searchResult: SearchResultItem[];
}

export interface HistoryProps {
  history: HistoryItem[];
}

export interface SearchResultProps {
  result: SearchResultItem[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  const historyDeleteClickHandler = (id: string) => {
    return id;
  };

  return (
    <div className="flex-col w-full">
      {history.map((h) => (
        <SearchHistory
          onClickToDeleteSearchHistory={() => historyDeleteClickHandler(h.id)}
          key={h.id}
          searchText={h.term}
        />
      ))}
    </div>
  );
};

const SearchResult: React.FC<SearchResultProps> = ({ result }) => {
  return (
    <div className="flex-col w-full">
      {result.map(({ type, result: r }, i) =>
        type === "room" ? (
          <RoomSearchResult key={i} room={r as RoomSearchResult} />
        ) : (
          <UserSearchResult key={i} user={r as UserSearchResult} />
        )
      )}
    </div>
  );
};

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  history,
  searchResult,
}) => {
  const [focused, setFocused] = useState(false);
  const [term, setTerm] = useState("");

  const setSearchTerm = ({
    currentTarget: { value },
  }: React.FormEvent<HTMLInputElement>) => setTerm(value);
  const focusHandler = () => setFocused(true);
  const blurHandler = () => setFocused(false);

  return (
    <SearchOverlay>
      <div className="flex-col w-full">
        <SearchBar
          className="mb-2"
          onFocus={focusHandler}
          onBlur={blurHandler}
          onChange={setSearchTerm}
        />
        {focused && !term && history && <History history={history} />}
        {focused && term && searchResult && (
          <SearchResult result={searchResult} />
        )}
      </div>
    </SearchOverlay>
  );
};
