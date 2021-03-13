import React from "react";
import { SmSolidSearch } from "../../icons";

export interface SearchBarProps
  extends React.ComponentPropsWithoutRef<"input"> {
  inputClassName?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className = "",
  inputClassName = "",
  ...props
}) => {
  return (
    <div
      className={`w-full bg-primary-700 text-primary-300 focus-within:text-primary-100 rounded-lg ${className}`}
    >
      <div className="h-full mx-4 flex items-center pointer-events-none">
        <SmSolidSearch />
      </div>
      <input
        className={`w-full py-2 pr-4 bg-transparent text-primary-100 placeholder-primary-300 focus:outline-none ${inputClassName}`}
        {...props}
      />
    </div>
  );
};
