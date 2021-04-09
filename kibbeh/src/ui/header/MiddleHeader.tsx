import React from "react";
import { useScreenType } from "../../shared-hooks/useScreenType";
import { SearchBar } from "../Search/SearchBar";
import LeftHeader from "./LeftHeader";
import RightHeader from "./RightHeader";

export interface MiddleHeaderProps {
  searchPlaceholder: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MiddleHeader: React.FC<MiddleHeaderProps> = ({
  searchPlaceholder,
  onSearchChange,
}) => {
  const screenType = useScreenType();
  return (
    <div className="flex-1 justify-center w-full">
      {screenType === "fullscreen" ? (
        <div className="mr-4">
          <LeftHeader />
        </div>
      ) : null}
      <SearchBar placeholder={searchPlaceholder} onChange={onSearchChange} />
      {screenType === "1-cols" || screenType === "fullscreen" ? (
        <div className="ml-4">
          <RightHeader />
        </div>
      ) : null}
    </div>
  );
};

export default MiddleHeader;
