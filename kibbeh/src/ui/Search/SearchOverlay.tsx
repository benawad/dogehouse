import React, { forwardRef, ReactElement } from "react";
import { getInitialProps } from "react-i18next";

export interface SearchOverlayProps {
  children: ReactElement;
  className?: string;
}

export const SearchOverlay = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ children, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`absolute flex flex-col py-2 rounded-8 bg-primary-800 border-primary-700 border ${className}`}
      style={{
        minHeight: "198px",
        top: "-10px",
        left: "-10px",
        boxShadow: "-3px 4px 14px rgba(0, 0, 0, 0.7)",
        width: "104%",
        zIndex: -1
      }}
      {...props}
      >
      {children}
    </div>
  );
});

SearchOverlay.displayName = "SearchOverlay";
