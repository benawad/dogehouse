import React from "react";
import { MainInnerGrid } from "../../ui/MainGrid";
import { LeftPanel, RightPanel } from "./GridPanels";

interface MainLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const DesktopLayout: React.FC<MainLayoutProps> = ({
  children,
  leftPanel,
  rightPanel,
}) => {
  return (
    <div
      className={`flex-col items-center w-full scrollbar-thin scrollbar-thumb-primary-700`}
    >
      <MainInnerGrid>
        <LeftPanel>{leftPanel}</LeftPanel>
        {children}
        <RightPanel>{rightPanel}</RightPanel>
      </MainInnerGrid>
    </div>
  );
};
