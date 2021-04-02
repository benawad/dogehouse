import React, { FC, useContext } from "react";
import { FixedGridPanel, GridPanel } from "../../ui/GridPanel";
import LeftHeader from "../../ui/header/LeftHeader";
import RightHeader from "../../ui/header/RightHeader";
import { MiddleHeaderController } from "../search/MiddleHeaderController";
import { WebSocketContext } from "../ws/WebSocketProvider";

interface LeftPanelProps {}

const HeaderWrapper: FC = ({ children }) => (
  <div className={`mb-7 h-6 items-center`}>{children}</div>
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
  return (
    <GridPanel>
      <div className="sticky top-0 w-full flex-col z-10 bg-primary-900 pt-5">
        <HeaderWrapper>
          <MiddleHeaderController />
        </HeaderWrapper>
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
      <HeaderWrapper>
        {conn ? (
          <RightHeader
            username={conn.user.username}
            avatarImg={conn.user.avatarUrl}
          />
        ) : null}
      </HeaderWrapper>
      {children}
    </FixedGridPanel>
  );
};
