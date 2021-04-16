import React from "react";
import { SearchBarController } from "../../modules/search/SearchBarController";
import { useScreenType } from "../../shared-hooks/useScreenType";
import LeftHeader from "./LeftHeader";
import RightHeader from "./RightHeader";

export interface MiddleHeaderProps {}

export const MiddleHeader: React.FC<MiddleHeaderProps> = () => {
  const screenType = useScreenType();
  return (
    <div className="flex flex-1 justify-center w-full">
      {screenType === "fullscreen" ? (
        <div className="flex mr-4">
          <LeftHeader />
        </div>
      ) : null}
      <SearchBarController />
      {screenType === "1-cols" || screenType === "fullscreen" ? (
        <div className="flex ml-4">
          <RightHeader />
        </div>
      ) : null}
    </div>
  );
};
