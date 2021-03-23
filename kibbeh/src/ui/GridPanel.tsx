import React from "react";

interface GridPanelProps {}

export const GridPanel: React.FC<GridPanelProps> = ({ children }) => {
  return <div className={`sticky top-0 flex-col h-7 mt-5`}>{children}</div>;
};
