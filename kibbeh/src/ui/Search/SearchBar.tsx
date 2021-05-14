import React from "react";
import { SolidSearch } from "../../icons";
import { Input } from "../Input";
import { Spinner } from "../Spinner";

export interface SearchBarProps
  extends React.ComponentPropsWithoutRef<"input"> {
  inputClassName?: string;
  mobile?: boolean;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className = "",
  inputClassName = "",
  isLoading = false,
  mobile = false,
  ...props
}) => {
  return (
    <div
      className={`items-center flex w-full bg-primary-700 text-primary-300 transition duration-200 ease-in-out focus-within:text-primary-100 rounded-lg ${
        mobile ? "px-4" : ""
      } ${className}`}
    >
      {!mobile && (
        <div className="h-full mx-4 flex items-center pointer-events-none">
          <SolidSearch />
        </div>
      )}
      <Input
        autoFocus
        data-testid="searchbar"
        className={`${inputClassName} pl-0`}
        {...props}
      />
      {isLoading && (
        <div
          className={`h-full flex items-center pointer-events-none ${
            !mobile && "mx-4"
          }`}
        >
          <Spinner />
        </div>
      )}
    </div>
  );
};
