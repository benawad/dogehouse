import React, { ReactElement } from "react";

export interface SearchOverlayProps {
  children: ReactElement;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ children }) => {
  return (
    <div
      style={{ borderRadius: "8px" }}
      className="w-full p-2 bg-primary-800 border border-primary-700"
    >
      {children}
    </div>
  );
};
