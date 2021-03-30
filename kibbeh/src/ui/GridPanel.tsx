import React from "react";

interface GridPanelProps {
  scroll?: boolean;
  sticky?: boolean;
}

export const GridPanel: React.FC<GridPanelProps> = ({
  children,
  scroll,
  sticky,
}) => {
  return (
    <div className={`flex-col ${sticky ? " sticky top-0 h-0" : ""}`}>
      <div
        className={`${scroll ? "" : `pt-5 h-screen`} flex-col flex-1 h-screen`}
      >
        {children}
      </div>
    </div>
  );
};
