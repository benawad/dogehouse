import React, { useContext } from "react";
import { GridPanel } from "../../ui/GridPanel";
import { LeftHeader } from "../../ui/header/LeftHeader";
import { RightHeader } from "../../ui/header/RightHeader";
import { MiddleHeaderController } from "../search/MiddleHeaderController";
import { WebSocketContext } from "../ws/WebSocketProvider";

interface LeftPanelProps {}

const Spacer = () => <div className={`mb-7`} />;

export const LeftPanel: React.FC<LeftPanelProps> = ({ children }) => {
  return (
    <GridPanel>
      <LeftHeader />
      <Spacer />
      {children}
    </GridPanel>
  );
};

export const MiddlePanel: React.FC<LeftPanelProps> = ({ children }) => {
  return (
    <GridPanel>
      <MiddleHeaderController />
      <Spacer />
      {children}
    </GridPanel>
  );
};

export const RightPanel: React.FC<LeftPanelProps> = ({ children }) => {
  const { conn } = useContext(WebSocketContext);
  return (
    <GridPanel>
      {conn ? <RightHeader avatarImg={conn.user.avatarUrl} /> : null}
      <Spacer />
      {children}
    </GridPanel>
  );
};
