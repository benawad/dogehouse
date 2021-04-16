import React from "react";

export const CenterLayout: React.FC = ({ children }) => {
  return (
    <div
      className={`flex max-w-screen-sm mx-auto w-full h-full flex flex-col relative`}
    >
      {children}
    </div>
  );
};
