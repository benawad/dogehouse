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
      style={{ borderRadius: "8px" }}
      className={`w-full px-2 pt-7 pb-5 bg-primary-800 border border-primary-700 ${className}`}
    >
      {children}
    </div>
  );
};
