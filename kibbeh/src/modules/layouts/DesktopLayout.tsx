import React from "react";
import { MainInnerGrid } from "../../ui/MainGrid";
import { HeaderController } from "../header/HeaderController";

interface MainLayoutProps {}

export const DesktopLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={`flex-col items-center w-full`}>
      <HeaderController />
      <MainInnerGrid>{children}</MainInnerGrid>
    </div>
  );
};
