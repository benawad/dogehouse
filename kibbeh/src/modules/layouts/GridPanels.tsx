import isElectron from "is-electron";
import React, { FC, useContext } from "react";
import { useIsElectronMobile } from "../../global-stores/useElectronMobileStore";
import { useHostStore } from "../../global-stores/useHostStore";
import { useScreenType } from "../../shared-hooks/useScreenType";
import { FixedGridPanel, GridPanel } from "../../ui/GridPanel";
import LeftHeader from "../../ui/header/LeftHeader";
import { MiddleHeader } from "../../ui/header/MiddleHeader";
import RightHeader from "../../ui/header/RightHeader";
import { WebSocketContext } from "../ws/WebSocketProvider";

interface LeftPanelProps {}

const HeaderWrapper: FC = ({ children }) => (
  <div className={`flex mb-7 h-6 items-center`}>{children}</div>
);

export const LeftPanel: React.FC<LeftPanelProps> = ({ children }) => {
  return (
    <FixedGridPanel>
      <HeaderWrapper>
        <LeftHeader />
      </HeaderWrapper>
      {children}
    </FixedGridPanel>
  );
};

export const MiddlePanel: React.FC<
  LeftPanelProps & { stickyChildren?: React.ReactNode }
> = ({ stickyChildren, children }) => {
  const screenType = useScreenType();
  return (
    <GridPanel>
      <div
        className={
          !(screenType === "fullscreen" && !stickyChildren)
            ? `flex sticky w-full flex-col z-10 bg-primary-900 pt-5`
            : ""
        }
        style={useIsElectronMobile() ? { marginTop: "45px" } : { top: "0px" }}
      >
        {screenType !== "fullscreen" ? (
          <HeaderWrapper>
            <MiddleHeader />
          </HeaderWrapper>
        ) : (
          ""
        )}
        {stickyChildren}
      </div>
      {children}
    </GridPanel>
  );
};

export const RightPanel: React.FC<LeftPanelProps> = ({ children }) => {
  const { conn } = useContext(WebSocketContext);
  return (
    <FixedGridPanel>
      <HeaderWrapper>{conn ? <RightHeader /> : null}</HeaderWrapper>
      {children}
    </FixedGridPanel>
  );
};
