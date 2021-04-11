import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import isElectron from "is-electron";
import React, { useEffect, useContext } from "react";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { RoomSectionHeader } from "../../ui/RoomSectionHeader";
import { useSplitUsersIntoSections } from "./useSplitUsersIntoSections";
import { WebSocketContext } from "../../modules/ws/WebSocketProvider";
import { useScreenType } from "../../shared-hooks/useScreenType";
import { useMediaQuery } from "react-responsive";

interface RoomUsersPanelProps extends JoinRoomAndGetInfoResponse {}

let ipcRenderer: any = undefined;
if (isElectron()) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

export const RoomUsersPanel: React.FC<RoomUsersPanelProps> = (props) => {
  const {
    askingToSpeak,
    listeners,
    speakers,
    canIAskToSpeak,
  } = useSplitUsersIntoSections(props);
  const { t } = useTypeSafeTranslation();
  const me = useContext(WebSocketContext).conn?.user || {};

  let gridTemplateColumns = "repeat(5, minmax(0, 1fr))";
  const screenType = useScreenType();
  const isBigFullscreen = useMediaQuery({ minWidth: 640 });

  if (isBigFullscreen && screenType === "fullscreen") {
    gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
  } else if (screenType === "fullscreen") {
    gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
  }

  useEffect(() => {
    if (isElectron()) {
      ipcRenderer.send("@room/data", {
        currentRoom: props,
        me,
      });
    }
  });

  return (
    <div
      className={`pt-4 px-4 flex-1 bg-primary-800`}
      id={props.room.isPrivate ? "private-room" : "public-room"}
    >
      <div className="w-full block">
        <div
          style={{
            gridTemplateColumns,
          }}
          className={`w-full grid gap-5`}
        >
          <RoomSectionHeader
            title={t("pages.room.speakers")}
            tagText={
              "" + (canIAskToSpeak ? speakers.length - 1 : speakers.length)
            }
          />
          {speakers}
          {askingToSpeak.length ? (
            <RoomSectionHeader
              title={t("pages.room.requestingToSpeak")}
              tagText={"" + askingToSpeak.length}
            />
          ) : null}
          {askingToSpeak}
          {listeners.length ? (
            <RoomSectionHeader
              title={t("pages.room.listeners")}
              tagText={"" + listeners.length}
            />
          ) : null}
          {listeners}
          <div className={`h-3 w-full col-span-full`}></div>
        </div>
      </div>
    </div>
  );
};
