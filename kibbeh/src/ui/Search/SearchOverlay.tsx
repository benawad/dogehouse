import React, { ReactElement } from "react";

export interface SearchOverlayProps {
  children: ReactElement;
  className?: string;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`w-full rounded-8 px-2 pt-7 pb-5 bg-primary-800 border border-primary-700 ${className}`}
    >
      {children}
    </div>
  );
};
