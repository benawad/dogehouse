import { Room, User } from "@dogehouse/kebab";
import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import SearchHistory from "./SearchHistory";
import { SearchOverlay } from "./SearchOverlay";
import { RoomSearchResult, UserSearchResult } from "./SearchResult";

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

export type SearchResultItem = User | Room;

export interface GlobalSearchProps {
  history: HistoryItem[];
  searchResults: SearchResultItem[];
}

export interface HistoryProps {
  history: HistoryItem[];
}

export interface SearchResultProps {
  items: SearchResultItem[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  const historyDeleteClickHandler = (id: string) => {
    return id;
  };

  return (
    <div className="flex flex-col w-full">
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

const SearchResult: React.FC<SearchResultProps> = ({ items }) => {
  return (
    <div className="flex flex-col w-full">
      {items.map((userOrRoom, i) =>
        "name" in userOrRoom ? (
          <RoomSearchResult key={i} room={userOrRoom} />
        ) : (
          <UserSearchResult key={i} user={userOrRoom} />
        )
      )}
    </div>
  );
};

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  history,
  searchResults,
}) => {
  const [focused, setFocused] = useState(false);
  const [term, setTerm] = useState("");

  const setSearchTerm = ({
    currentTarget: { value },
  }: React.FormEvent<HTMLInputElement>) => setTerm(value);
  const focusHandler = () => setFocused(true);
  const blurHandler = () => setFocused(false);

  return (
    <div className="flex w-full relative">
      <div className="flex relative z-10 w-full p-2">
        <SearchBar
          className="mb-2"
          onFocus={focusHandler}
          onBlur={blurHandler}
          onChange={setSearchTerm}
        />
      </div>
      {focused && (
        <SearchOverlay className="absolute z-0">
          <div className="flex flex-col w-full">
            {!term && history && <History history={history} />}
            {term && searchResults && <SearchResult items={searchResults} />}
          </div>
        </SearchOverlay>
      )}
    </div>
  );
};
