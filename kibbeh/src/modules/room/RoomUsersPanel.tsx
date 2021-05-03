import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import isElectron from "is-electron";
import React, { useEffect, useContext } from "react";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { RoomSectionHeader } from "../../ui/RoomSectionHeader";
import { useSplitUsersIntoSections } from "./useSplitUsersIntoSections";
import { WebSocketContext } from "../../modules/ws/WebSocketProvider";
import { useScreenType } from "../../shared-hooks/useScreenType";
import { useMediaQuery } from "react-responsive";
import { AudioDebugPanel } from "../debugging/AudioDebugPanel";
import { useDebugAudioStore } from "../../global-stores/useDebugAudio";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useDeafStore } from "../../global-stores/useDeafStore";
import { isWebRTCEnabled } from "../../lib/isWebRTCEnabled";
import { useIsElectronMobile } from "../../global-stores/useElectronMobileStore";

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
  const me = useContext(WebSocketContext).conn?.user;
  const muted = useMuteStore().muted;
  const deafened = useDeafStore().deafened;
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
        muted,
        deafened,
        me: me || {},
      });
    }
  }, [props, muted, deafened, me]);

  const { debugAudio } = useDebugAudioStore();

  return (
    <div
      className={`flex pt-4 px-4 flex-1 ${
        screenType !== "fullscreen" ? "bg-primary-800" : "bg-primary-900"
      }`}
      id={props.room.isPrivate ? "private-room" : "public-room"}
      style={useIsElectronMobile() ? { marginTop: "38px" } : { top: "0px" }}
    >
      <div className="w-full block">
        {!isWebRTCEnabled() ? (
          <div className="text-accent bg-primary-600 p-1 mb-2">
            Your browser does not support WebRTC or it is disabled.
          </div>
        ) : null}
        {debugAudio ? <AudioDebugPanel /> : null}
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
          <div className={`flex h-3 w-full col-span-full`}></div>
        </div>
      </div>
    </div>
  );
};
