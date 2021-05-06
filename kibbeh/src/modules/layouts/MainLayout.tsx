import isElectron from "is-electron";
import router from "next/router";
import React from "react";
import { useIsElectronMobile } from "../../global-stores/useElectronMobileStore";
import { useHostStore } from "../../global-stores/useHostStore";
import {
  SolidCalendar,
  SolidHome,
  SolidPersonAdd,
  SolidPlus,
  SolidUser,
} from "../../icons";
import { useConn } from "../../shared-hooks/useConn";
import { useScreenType } from "../../shared-hooks/useScreenType";
import { MainInnerGrid } from "../../ui/MainGrid";
import { AccountOverlay } from "../../ui/mobile/AccountOverlay";
import { ProfileHeader } from "../../ui/mobile/MobileHeader";
import { MobileNav } from "../../ui/mobile/MobileNav";
import { ElectronHeader } from "./ElectronHeader";
import { FloatingRoomInfo } from "./FloatingRoomInfo";
import { LeftPanel, RightPanel } from "./GridPanels";
import { TabletSidebar } from "./TabletSidebar";

interface MainLayoutProps {
  floatingRoomInfo?: React.ReactNode;
  tabletSidebar?: React.ReactNode;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  mobileHeader?: React.ReactNode /** This is an optional parameter in-case you want a custom mobile header (e.g a search header) */;
  plusButtonURL?: string /** This adds a plus button in the bottom mobile nav */;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  leftPanel = <div />,
  rightPanel = <div />,
  tabletSidebar = <TabletSidebar />,
  floatingRoomInfo = <FloatingRoomInfo />,
  mobileHeader,
  plusButtonURL,
}) => {
  const screenType = useScreenType();
  const conn = useConn()!;
  const me = conn ? conn.user : undefined;
  const mHeader = mobileHeader || (
    <ProfileHeader
      avatar={me ? me.avatarUrl : "https://dogehouse.tv/favicon.ico"}
      onSearchClick={() => router.push("/search")}
    />
  );

  const items = [
    { icon: <SolidHome />, targetPath: "/dash" },
    { icon: <SolidCalendar />, targetPath: "/scheduled-rooms" },
  ];

  if (plusButtonURL) {
    items.push({ icon: <SolidPlus />, targetPath: plusButtonURL });
  }

  if (me) {
    items.push({
      icon: <SolidUser />,
      targetPath: `/u/${me.username}/following-online`,
    });
  }

  let middle = null;
  let prepend = null;

  switch (screenType) {
    case "3-cols":
      middle = (
        <>
          <LeftPanel>{leftPanel}</LeftPanel>
          {children}
          <RightPanel>{rightPanel}</RightPanel>
        </>
      );
      break;
    case "2-cols":
      middle = (
        <>
          <LeftPanel>{tabletSidebar}</LeftPanel>
          {children}
          <RightPanel>{rightPanel}</RightPanel>
        </>
      );
      break;
    case "1-cols":
      middle = (
        <>
          <LeftPanel>{tabletSidebar}</LeftPanel>
          {children}
          {floatingRoomInfo}
        </>
      );
      break;
    case "fullscreen":
      prepend = (
        <>
          {mHeader}
          <MobileNav items={items}></MobileNav>
        </>
      );
      middle = (
        <>
          {children}
          {floatingRoomInfo}
          <AccountOverlay />
        </>
      );
  }

  return (
    <>
      <ElectronHeader />
      <div
        className={`fixed left-0 w-full z-10`}
        style={
          isElectron() && !useHostStore.getState().isLinux
            ? { top: 30 }
            : { top: 0 }
        }
      >
        {prepend}
      </div>
      <div
        className={
          isElectron() && !useHostStore.getState().isLinux
            ? `default-desktop-layout flex flex-col items-center w-full scrollbar-thin scrollbar-thumb-primary-700 ${
                prepend ? "mb-7" : ""
              }`
            : `flex flex-col items-center w-full scrollbar-thin scrollbar-thumb-primary-700 ${
                prepend ? "mt-8 mb-7" : ""
              }`
        }
        style={useIsElectronMobile() ? { marginTop: "38px" } : {}}
      >
        <MainInnerGrid>{middle}</MainInnerGrid>
      </div>
    </>
  );
};
