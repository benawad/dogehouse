import React from "react";
import { useScreenType } from "../../shared-hooks/useScreenType";
import { MainInnerGrid } from "../../ui/MainGrid";
import { LeftPanel, RightPanel } from "./GridPanels";

interface MainLayoutProps {
  tabletSidebar: React.ReactNode;
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const DesktopLayout: React.FC<MainLayoutProps> = ({
  children,
  leftPanel,
  rightPanel,
  tabletSidebar,
}) => {
  const screenType = useScreenType();

  let middle = null;

  if (screenType === "3-cols") {
    middle = (
      <>
        <LeftPanel>{leftPanel}</LeftPanel>
        {children}
        <RightPanel>{rightPanel}</RightPanel>
      </>
    );
  } else if (screenType === "2-cols") {
    middle = (
      <>
        <LeftPanel>{tabletSidebar}</LeftPanel>
        {children}
        <RightPanel>{rightPanel}</RightPanel>
      </>
    );
  } else if (screenType === "1-cols") {
    middle = (
      <>
        <LeftPanel>{tabletSidebar}</LeftPanel>
        {children}
      </>
    );
  } else if (screenType === "fullscreen") {
    middle = <>{children}</>;
  }

  return (
    <div
      className={`flex-col items-center w-full scrollbar-thin scrollbar-thumb-primary-700`}
    >
      <MainInnerGrid>{middle}</MainInnerGrid>
    </div>
  );
};
