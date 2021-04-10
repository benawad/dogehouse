import React from "react";
import { SolidCaretRight } from "../../../icons";
import { SearchBar } from "../../Search/SearchBar";

export interface SearchHeaderProps {
  onBackClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => null;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => null;
  searchPlaceholder: string;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  onBackClick,
  onSearchChange,
  searchPlaceholder,
}) => {
  return (
    <div className="w-full px-3 py-2 bg-primary-900 text-primary-100">
      {onBackClick && (
        <button onClick={onBackClick}>
          <SolidCaretRight
            className="m-auto transform -rotate-180"
            height={20}
            width={20}
          />
        </button>
      )}
      <SearchBar placeholder={searchPlaceholder} onChange={onSearchChange} />
    </div>
  );
};
