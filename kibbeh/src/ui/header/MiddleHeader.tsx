import React from "react";
import { SearchBar } from "../Search/SearchBar";

export interface MiddleHeaderProps {
  searchPlaceholder: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MiddleHeader: React.FC<MiddleHeaderProps> = ({
  searchPlaceholder,
  onSearchChange,
}) => {
  return (
    <div className="flex-1 justify-center w-full">
      <SearchBar placeholder={searchPlaceholder} onChange={onSearchChange} />
    </div>
  );
};

export default MiddleHeader;
