import React from "react";

export const GridPanel: React.FC = ({ children }) => {
  return <div className={`flex-col flex-1 h-screen`}>{children}</div>;
};

export const FixedGridPanel: React.FC = ({ children }) => {
  return <div className={`pt-5 flex-col flex-1 h-screen`}>{children}</div>;
};
