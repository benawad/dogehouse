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
      className={`relative flex flex-col w-full rounded-8 bg-primary-800 border border-primary-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

SearchOverlay.displayName = "SearchOverlay";
