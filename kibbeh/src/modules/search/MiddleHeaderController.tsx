import React from "react";
import MiddleHeader from "../../ui/header/MiddleHeader";

interface SearchBarControllerProps {}

export const MiddleHeaderController: React.FC<SearchBarControllerProps> = ({}) => {
  return (
    <MiddleHeader
      onSearchChange={() => {}}
      searchPlaceholder="Search for rooms, users or categories"
    />
  );
};
