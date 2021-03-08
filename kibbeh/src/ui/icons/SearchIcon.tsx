import React from "react";

interface SearchIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  className?: string;
}

export const SearchIcon: React.FC<SearchIconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7.25 13.25a6 6 0 100-12 6 6 0 000 12zm7.5 1.5l-3.263-3.263"
      ></path>
    </svg>
  );
};
