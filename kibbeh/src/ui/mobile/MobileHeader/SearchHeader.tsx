import React from "react";
import { SolidCaretRight } from "../../../icons";
import { SearchBar } from "../../Search/SearchBar";

export interface SearchHeaderProps {
  onBackClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder: string;
  searchLoading: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  onBackClick,
  onSearchChange,
  searchPlaceholder,
  searchLoading,
}) => {
  return (
    <div
      className="flex w-full px-4 gap-1 bg-primary-900 text-primary-100"
      style={{ paddingTop: 17, paddingBottom: 17 }}
    >
      {onBackClick && (
        <button onClick={onBackClick}>
          <SolidCaretRight
            className="m-auto transform -rotate-180"
            height={20}
            width={20}
          />
        </button>
      )}
      <SearchBar
        mobile={true}
        placeholder={searchPlaceholder}
        onChange={onSearchChange}
        isLoading={searchLoading}
      />
    </div>
  );
};
