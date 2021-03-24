import React from "react";

interface GridPanelProps {
  scroll?: boolean;
}

export const GridPanel: React.FC<GridPanelProps> = ({ children, scroll }) => {
  return (
    <div className={`flex-col h-full`}>
      <div className={`${scroll ? "" : `pt-5 sticky top-0`} flex-col`}>
        {children}
      </div>
    </div>
  );
};
