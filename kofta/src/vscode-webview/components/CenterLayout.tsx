import React from "react";
import { tw } from "twind";

export const CenterLayout: React.FC = ({ children }) => {
  return (
    <div
      className={tw`max-w-screen-sm mx-auto w-full h-full flex flex-col relative`}
    >
      {children}
    </div>
  );
};
