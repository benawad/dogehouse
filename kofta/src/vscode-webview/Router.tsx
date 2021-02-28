import React from "react";
import { BrowserRouter } from "react-router-dom";
import { WebRtcApp } from "../webrtc/WebRtcApp";
import { AlertModal } from "./components/AlertModal";
import { CenterLayout } from "./components/CenterLayout";
import { ConfirmModal } from "./components/ConfirmModal";
import { InvitedToJoinRoomModal } from "./components/InvitedToJoinRoomModal";
import { MicPermissionBanner } from "./components/MicPermissionBanner";
import { PromptModal } from "./components/PromptModal";
import { RoomChat } from "./modules/room-chat/RoomChat";
import { Routes } from "./Routes";

interface RouterProps {}

export const Router: React.FC<RouterProps> = () => {
  return (
    <BrowserRouter>
      <WebRtcApp />
      <div className={`mx-auto max-w-5xl w-full h-full flex relative`}>
        <CenterLayout>
          <Routes />
          <MicPermissionBanner />
        </CenterLayout>
        <RoomChat sidebar />
      </div>
      <InvitedToJoinRoomModal />
      <AlertModal />
      <PromptModal />
      <ConfirmModal />
    </BrowserRouter>
  );
};
