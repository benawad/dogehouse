import { JoinRoomAndGetInfoResponse, Room } from "@dogehouse/kebab";
import isElectron from "is-electron";
import React, { useEffect, useState } from "react";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { RoomAvatar } from "../../ui/RoomAvatar";
import { RoomSectionHeader } from "../../ui/RoomSectionHeader";
import { UserPreviewModalProvider } from "./UserPreviewModalProvider";
import { useSplitUsersIntoSections } from "./useSplitUsersIntoSections";

interface RoomUsersPanelProps extends JoinRoomAndGetInfoResponse {}

let ipcRenderer: any = undefined;
if (isElectron()) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

const isMac = process.platform === "darwin";

export const RoomUsersPanel: React.FC<RoomUsersPanelProps> = (props) => {
  const {
    askingToSpeak,
    listeners,
    speakers,
    canIAskToSpeak,
  } = useSplitUsersIntoSections(props);
  const { t } = useTypeSafeTranslation();

  const [ipcStarted, setIpcStarted] = useState(false);
  useEffect(() => {
    if (isElectron() && !isMac) {
      ipcRenderer.send("@overlay/start_ipc", true);
      ipcRenderer.on(
        "@overlay/start_ipc",
        (event: any, shouldStart: boolean) => {
          setIpcStarted(shouldStart);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (isElectron() && ipcStarted) {
      ipcRenderer.send("@overlay/overlayData", {
        currentRoom: props,
        roomID: props.roomId,
      });
    }
  });

  return (
    <div
      className={`pt-4 px-4 flex-1 bg-primary-800 scrollbar-thin scrollbar-thumb-primary-700`}
    >
      <div
        style={{
          gridTemplateColumns: "repeat(auto-fit, 90px)",
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
        <div className={`h-3 w-full col-span-5`}></div>
      </div>
    </div>
  );
};
