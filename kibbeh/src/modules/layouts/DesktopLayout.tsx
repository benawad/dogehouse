import React from "react";
import { MainInnerGrid } from "../../ui/MainGrid";

interface MainLayoutProps {}

export const DesktopLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div
      className={`flex-col items-center w-full scrollbar-thin scrollbar-thumb-primary-700`}
    >
      <MainInnerGrid>{children}</MainInnerGrid>
    </div>
  );
};
