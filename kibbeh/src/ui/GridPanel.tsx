import React from "react";

export const GridPanel: React.FC = ({ children }) => {
  return <div className={`flex-col flex-1`}>{children}</div>;
};

export const FixedGridPanel: React.FC = ({ children }) => {
  return (
    <div className={`pt-5 flex-col flex-1 sticky top-0 h-screen`}>
      {children}
    </div>
  );
};
